package ma.fsa.codelearn.api.apprenant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;
import ma.fsa.codelearn.api.dto.CourseDetailDto;
import ma.fsa.codelearn.api.dto.CourseSummaryDto;
import ma.fsa.codelearn.api.dto.ModuleDto;
import ma.fsa.codelearn.api.dto.ModuleProgressDto;
import ma.fsa.codelearn.api.dto.SupportAccessDto;
import ma.fsa.codelearn.api.dto.SupportDto;
import ma.fsa.codelearn.domain.ResourceType;
import ma.fsa.codelearn.domain.service.ApprenantService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ApprenantController.class)
class ApprenantControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private ApprenantService apprenantService;

  @Test
  void searchCourses_returnsPagedSummaries() throws Exception {
    CourseSummaryDto summary =
        CourseSummaryDto.builder()
            .id(1L)
            .title("Java Basics")
            .description("Intro")
            .authorName("Alice")
            .supportsCount(3L)
            .build();
    Page<CourseSummaryDto> page = new PageImpl<>(List.of(summary), PageRequest.of(0, 10), 1);
    when(apprenantService.searchCourses(eq("java"), any(Pageable.class))).thenReturn(page);

    mockMvc
        .perform(get("/api/apprenant/courses").param("query", "java").param("size", "10"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].title").value("Java Basics"));

    verify(apprenantService).searchCourses(eq("java"), any(Pageable.class));
  }

  @Test
  void courseDetails_returnsDetailPayload() throws Exception {
    CourseDetailDto detail =
        CourseDetailDto.builder()
            .id(5L)
            .title("Java Basics")
            .authorName("Alice")
            .modules(
                List.of(
                    ModuleDto.builder()
                        .id(10L)
                        .title("PDF #10")
                        .type(ResourceType.PDF)
                        .completed(true)
                        .completedAt(Instant.now())
                        .build()))
            .supports(
                List.of(
                    SupportDto.builder()
                        .id(10L)
                        .type(ResourceType.PDF)
                        .title("PDF #10")
                        .accessEndpoint("/api/apprenant/supports/10/access")
                        .build()))
            .build();
    when(apprenantService.getCourseDetails(5L, 1L)).thenReturn(detail);

    mockMvc
        .perform(get("/api/apprenant/courses/5"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.modules[0].completed").value(true));

    verify(apprenantService).getCourseDetails(5L, 1L);
  }

  @Test
  void requestSupportAccess_returnsTemporaryUrl() throws Exception {
    SupportAccessDto dto =
        SupportAccessDto.builder()
            .supportId(10L)
            .type(ResourceType.PDF)
            .temporaryUrl("https://cdn.example.com/java.pdf?token=abc")
            .expiresAt(Instant.now().plusSeconds(60))
            .build();
    when(apprenantService.requestSupportAccess(10L, 1L)).thenReturn(dto);

    mockMvc
        .perform(post("/api/apprenant/supports/10/access"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.temporaryUrl").value(dto.getTemporaryUrl()));

    verify(apprenantService).requestSupportAccess(10L, 1L);
  }

  @Test
  void completeModule_returnsProgressPayload() throws Exception {
    ModuleProgressDto progress =
        ModuleProgressDto.builder()
            .courseId(5L)
            .moduleId(10L)
            .apprenantId(1L)
            .completedAt(Instant.now())
            .build();
    when(apprenantService.completeModule(5L, 10L, 1L)).thenReturn(progress);

    mockMvc
        .perform(post("/api/apprenant/courses/5/modules/10/complete"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.moduleId").value(10L));

    verify(apprenantService).completeModule(5L, 10L, 1L);
  }
}
