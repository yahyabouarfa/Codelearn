package ma.fsa.codelearn.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseSummaryDto {
  private Long id;
  private String title;
  private String description;
  private String authorName;
  private long supportsCount;
}
