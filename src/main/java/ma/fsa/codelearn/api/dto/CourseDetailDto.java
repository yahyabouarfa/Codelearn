package ma.fsa.codelearn.api.dto;

import java.util.List;
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
public class CourseDetailDto {
  private Long id;
  private String title;
  private String description;
  private String authorName;
  private List<ModuleDto> modules;
  private List<SupportDto> supports;
}
