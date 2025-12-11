package ma.fsa.codelearn.domain.service.impl;

import jakarta.persistence.EntityNotFoundException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.RequiredArgsConstructor;
import ma.fsa.codelearn.api.dto.CourseDetailDto;
import ma.fsa.codelearn.api.dto.CourseSummaryDto;
import ma.fsa.codelearn.api.dto.ModuleDto;
import ma.fsa.codelearn.api.dto.ModuleProgressDto;
import ma.fsa.codelearn.api.dto.SupportAccessDto;
import ma.fsa.codelearn.api.dto.SupportDto;
import ma.fsa.codelearn.domain.Course;
import ma.fsa.codelearn.domain.ResourceType;
import ma.fsa.codelearn.domain.SupportPedagogique;
import ma.fsa.codelearn.domain.service.ApprenantService;
import ma.fsa.codelearn.repo.CourseRepo;
import ma.fsa.codelearn.repo.SupportPedagogiqueRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ApprenantServiceImpl implements ApprenantService {

  private static final Duration TEMP_URL_DURATION = Duration.ofMinutes(30);

  private final CourseRepo courseRepo;
  private final SupportPedagogiqueRepo supportRepo;
  private final ConcurrentMap<Long, ConcurrentMap<Long, Instant>> completionStore =
      new ConcurrentHashMap<>();

  @Override
  public Page<CourseSummaryDto> searchCourses(String query, Pageable pageable) {
    String normalizedQuery = (query == null || query.isBlank()) ? null : query.trim();
    Page<Course> courses = courseRepo.search(normalizedQuery, pageable);
    return courses.map(this::toCourseSummaryDto);
  }

  @Override
  public CourseDetailDto getCourseDetails(Long courseId, Long apprenantId) {
    Course course =
        courseRepo
            .findByIdAndValideParAdminTrue(courseId)
            .orElseThrow(() -> new EntityNotFoundException("Course not found or not validated: " + courseId));

    List<SupportPedagogique> supportEntities = supportRepo.findByCoursIdOrderByIdAsc(courseId);

    List<SupportDto> supports = supportEntities.stream().map(this::toSupportDto).toList();
    List<ModuleDto> modules =
        supportEntities.stream().map(s -> toModuleDto(s, apprenantId)).toList();

    return CourseDetailDto.builder()
        .id(course.getId())
        .title(course.getTitre())
        .description(course.getDescription())
        .authorName(getAuthorName(course))
        .modules(modules)
        .supports(supports)
        .build();
  }

  @Override
  public SupportAccessDto requestSupportAccess(Long supportId, Long apprenantId) {
    SupportPedagogique support =
        supportRepo
            .findById(supportId)
            .orElseThrow(() -> new EntityNotFoundException("Support not found: " + supportId));

    Course course = support.getCours();
    if (course == null || !Boolean.TRUE.equals(course.getValideParAdmin())) {
      throw new EntityNotFoundException("Support not validated for learner access: " + supportId);
    }

    Instant expiresAt = Instant.now().plus(TEMP_URL_DURATION);
    String temporaryUrl = generateTemporaryUrl(support, apprenantId, expiresAt);

    return SupportAccessDto.builder()
        .supportId(support.getId())
        .type(support.getTypeSupport())
        .temporaryUrl(temporaryUrl)
        .expiresAt(expiresAt)
        .build();
  }

  @Override
  public ModuleProgressDto completeModule(Long courseId, Long moduleId, Long apprenantId) {
    SupportPedagogique support =
        supportRepo
            .findById(moduleId)
            .orElseThrow(() -> new EntityNotFoundException("Support not found: " + moduleId));
    if (support.getCours() == null || !support.getCours().getId().equals(courseId)) {
      throw new EntityNotFoundException(
          "Module "
              + moduleId
              + " is not part of course "
              + courseId);
    }
    if (!Boolean.TRUE.equals(support.getCours().getValideParAdmin())) {
      throw new EntityNotFoundException("Course not validated: " + courseId);
    }
    Instant completedAt = recordModuleCompletion(apprenantId, moduleId);
    return ModuleProgressDto.builder()
        .courseId(courseId)
        .moduleId(moduleId)
        .apprenantId(apprenantId)
        .completedAt(completedAt)
        .build();
  }

  private CourseSummaryDto toCourseSummaryDto(Course course) {
    long supportsCount = supportRepo.countByCoursId(course.getId());
    return CourseSummaryDto.builder()
        .id(course.getId())
        .title(course.getTitre())
        .description(course.getDescription())
        .authorName(getAuthorName(course))
        .supportsCount(supportsCount)
        .build();
  }

  private SupportDto toSupportDto(SupportPedagogique support) {
    Long courseId = support.getCours() != null ? support.getCours().getId() : null;
    return SupportDto.builder()
        .id(support.getId())
        .type(support.getTypeSupport())
        .title(buildSupportTitle(support))
        .description("Access via secure endpoint to obtain a time-limited URL.")
        .accessEndpoint(generateAccessEndpoint(support.getId()))
        .courseId(courseId)
        .build();
  }

  private ModuleDto toModuleDto(SupportPedagogique support, Long apprenantId) {
    Instant completedAt = getCompletionTime(apprenantId, support.getId());
    return ModuleDto.builder()
        .id(support.getId())
        .title(buildSupportTitle(support))
        .type(support.getTypeSupport())
        .completed(completedAt != null)
        .completedAt(completedAt)
        .build();
  }

  private String buildSupportTitle(SupportPedagogique support) {
    ResourceType type = support.getTypeSupport();
    return (type != null ? type.name() : "SUPPORT") + " #" + support.getId();
  }

  private String generateAccessEndpoint(Long supportId) {
    return "/api/apprenant/supports/" + supportId + "/access";
  }

  private String generateTemporaryUrl(SupportPedagogique support, Long apprenantId, Instant expiresAt) {
    String payload =
        support.getUrl()
            + "|user:"
            + apprenantId
            + "|exp:"
            + expiresAt.toEpochMilli();
    String token = Base64.getUrlEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    String separator = support.getUrl().contains("?") ? "&" : "?";
    return support.getUrl() + separator + "token=" + token + "&expiresAt=" + expiresAt.toEpochMilli();
  }

  private Instant recordModuleCompletion(Long apprenantId, Long moduleId) {
    Instant now = Instant.now();
    completionStore
        .computeIfAbsent(apprenantId, key -> new ConcurrentHashMap<>())
        .put(moduleId, now);
    return now;
  }

  private Instant getCompletionTime(Long apprenantId, Long moduleId) {
    ConcurrentMap<Long, Instant> userModules = completionStore.get(apprenantId);
    return userModules != null ? userModules.get(moduleId) : null;
  }

  private String getAuthorName(Course course) {
    return course.getCreateur() != null ? course.getCreateur().getNom() : null;
  }
}
