package ma.fsa.codelearn.api.apprenant;

import lombok.RequiredArgsConstructor;
import ma.fsa.codelearn.api.dto.CourseDetailDto;
import ma.fsa.codelearn.api.dto.CourseSummaryDto;
import ma.fsa.codelearn.api.dto.ModuleProgressDto;
import ma.fsa.codelearn.api.dto.SupportAccessDto;
import ma.fsa.codelearn.domain.service.ApprenantService;
import ma.fsa.codelearn.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/apprenant")
@RequiredArgsConstructor
public class ApprenantController {

  private final ApprenantService apprenantService;

  /**
   * Example:
   *
   * <pre>
   * curl "http://localhost:8080/api/apprenant/courses?query=java&page=0&size=5"
   * </pre>
   *
   * Example response body (truncated):
   *
   * <pre>
   * {
   *   "content": [
   *     {"id": 1, "title": "Java Basics", "supportsCount": 3}
   *   ]
   * }
   * </pre>
   *
   * @return a page of {@link CourseSummaryDto} records matching the optional query.
   */
  @GetMapping("/courses")
  public Page<CourseSummaryDto> searchCourses(
      @RequestParam(value = "query", required = false) String query,
      @RequestParam(value = "page", defaultValue = "0") int page,
      @RequestParam(value = "size", defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return apprenantService.searchCourses(query, pageable);
  }

  /**
   * Example:
   *
   * <pre>
   * curl "http://localhost:8080/api/apprenant/courses/1"
   * </pre>
   *
   * Example response body (truncated):
   *
   * <pre>
   * {
   *   "id": 1,
   *   "modules": [{"id": 10, "title": "PDF #10"}],
   *   "supports": [{"id": 10, "accessEndpoint": "/api/apprenant/supports/10/access"}]
   * }
   * </pre>
   */
  @GetMapping("/courses/{courseId}")
  public CourseDetailDto courseDetails(@PathVariable Long courseId) {
    Long apprenantId = SecurityUtils.currentUserId();
    return apprenantService.getCourseDetails(courseId, apprenantId);
  }

  /**
   * Example:
   *
   * <pre>
   * curl -X POST "http://localhost:8080/api/apprenant/supports/1/access"
   * </pre>
   *
   * Example response body:
   *
   * <pre>
   * {
   *   "supportId": 1,
   *   "temporaryUrl": "https://cdn.example.com/doc.pdf?token=***",
   *   "expiresAt": "2024-01-01T12:30:00Z"
   * }
   * </pre>
   */
  @PostMapping("/supports/{supportId}/access")
  public SupportAccessDto support(@PathVariable Long supportId) {
    Long apprenantId = SecurityUtils.currentUserId();
    return apprenantService.requestSupportAccess(supportId, apprenantId);
  }

  /**
   * Example:
   *
   * <pre>
   * curl -X POST "http://localhost:8080/api/apprenant/courses/1/modules/10/complete"
   * </pre>
   *
   * Example response body:
   *
   * <pre>
   * {
   *   "courseId": 1,
   *   "moduleId": 10,
   *   "apprenantId": 1,
   *   "completedAt": "2024-01-01T12:45:00Z"
   * }
   * </pre>
   */
  @PostMapping("/courses/{courseId}/modules/{moduleId}/complete")
  public ModuleProgressDto completeModule(
      @PathVariable Long courseId, @PathVariable Long moduleId) {
    Long apprenantId = SecurityUtils.currentUserId();
    return apprenantService.completeModule(courseId, moduleId, apprenantId);
  }
}
