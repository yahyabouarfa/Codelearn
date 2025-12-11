package ma.fsa.codelearn.domain.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import ma.fsa.codelearn.api.dto.CourseDetailDto;
import ma.fsa.codelearn.api.dto.CourseSummaryDto;
import ma.fsa.codelearn.api.dto.ModuleDto;
import ma.fsa.codelearn.api.dto.ModuleProgressDto;
import ma.fsa.codelearn.api.dto.SupportAccessDto;
import ma.fsa.codelearn.domain.Course;
import ma.fsa.codelearn.domain.ResourceType;
import ma.fsa.codelearn.domain.SupportPedagogique;
import ma.fsa.codelearn.domain.User;
import ma.fsa.codelearn.repo.CourseRepo;
import ma.fsa.codelearn.repo.SupportPedagogiqueRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class ApprenantServiceImplTest {

  @Mock private CourseRepo courseRepo;
  @Mock private SupportPedagogiqueRepo supportRepo;

  @InjectMocks private ApprenantServiceImpl apprenantService;

  private Course sampleCourse;
  private SupportPedagogique sampleSupport;

  @BeforeEach
  void setupEntities() {
    User creator = new User();
    creator.setNom("Alice");

    sampleCourse = new Course();
    sampleCourse.setId(5L);
    sampleCourse.setTitre("Java Basics");
    sampleCourse.setDescription("Intro course");
    sampleCourse.setCreateur(creator);
    sampleCourse.setValideParAdmin(true);

    sampleSupport = new SupportPedagogique();
    sampleSupport.setId(10L);
    sampleSupport.setTypeSupport(ResourceType.PDF);
    sampleSupport.setUrl("https://cdn.example.com/java.pdf");
    sampleSupport.setCours(sampleCourse);
  }

  @Test
  void searchCourses_trimsQueryAndMapsSummaries() {
    Page<Course> page = new PageImpl<>(List.of(sampleCourse), PageRequest.of(0, 5), 1);
    when(courseRepo.search(eq("java"), any(Pageable.class))).thenReturn(page);
    when(supportRepo.countByCoursId(5L)).thenReturn(1L);

    Page<CourseSummaryDto> result = apprenantService.searchCourses("  java ", PageRequest.of(0, 5));

    verify(courseRepo).search(eq("java"), eq(PageRequest.of(0, 5)));
    assertThat(result.getContent()).hasSize(1);
    CourseSummaryDto summary = result.getContent().get(0);
    assertThat(summary.getId()).isEqualTo(sampleCourse.getId());
    assertThat(summary.getTitle()).isEqualTo("Java Basics");
    assertThat(summary.getAuthorName()).isEqualTo("Alice");
  }

  @Test
  void requestSupportAccess_generatesTemporaryUrl() {
    when(supportRepo.findById(10L)).thenReturn(Optional.of(sampleSupport));
    sampleSupport.getCours().setValideParAdmin(true);
    Instant before = Instant.now();

    SupportAccessDto dto = apprenantService.requestSupportAccess(10L, 99L);

    assertThat(dto.getType()).isEqualTo(ResourceType.PDF);
    assertThat(dto.getTemporaryUrl()).contains("https://cdn.example.com/java.pdf");
    assertThat(dto.getTemporaryUrl()).contains("token=");
    assertThat(dto.getExpiresAt()).isAfter(before);
  }

  @Test
  void completeModule_recordsProgressAndReflectsInCourseDetails() {
    when(supportRepo.findById(10L)).thenReturn(Optional.of(sampleSupport));
    when(courseRepo.findByIdAndValideParAdminTrue(5L)).thenReturn(Optional.of(sampleCourse));
    when(supportRepo.findByCoursIdOrderByIdAsc(5L)).thenReturn(List.of(sampleSupport));

    ModuleProgressDto progress = apprenantService.completeModule(5L, 10L, 1L);
    assertThat(progress.getCompletedAt()).isNotNull();

    CourseDetailDto detail = apprenantService.getCourseDetails(5L, 1L);
    List<ModuleDto> modules = detail.getModules();
    assertThat(modules).hasSize(1);
    ModuleDto module = modules.get(0);
    assertThat(module.isCompleted()).isTrue();
    assertThat(module.getCompletedAt()).isEqualTo(progress.getCompletedAt());
  }

  @Test
  void completeModule_throwsWhenSupportNotInCourse() {
    Course otherCourse = new Course();
    otherCourse.setId(7L);
    sampleSupport.setCours(otherCourse);
    when(supportRepo.findById(10L)).thenReturn(Optional.of(sampleSupport));

    assertThatThrownBy(() -> apprenantService.completeModule(5L, 10L, 1L))
        .isInstanceOf(EntityNotFoundException.class);
  }
}
