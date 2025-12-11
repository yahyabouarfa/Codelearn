package ma.fsa.codelearn.domain.service;

import ma.fsa.codelearn.api.dto.CourseDetailDto;
import ma.fsa.codelearn.api.dto.CourseSummaryDto;
import ma.fsa.codelearn.api.dto.ModuleProgressDto;
import ma.fsa.codelearn.api.dto.SupportAccessDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApprenantService {
  Page<CourseSummaryDto> searchCourses(String query, Pageable pageable);

  CourseDetailDto getCourseDetails(Long courseId, Long apprenantId);

  SupportAccessDto requestSupportAccess(Long supportId, Long apprenantId);

  ModuleProgressDto completeModule(Long courseId, Long moduleId, Long apprenantId);
}
