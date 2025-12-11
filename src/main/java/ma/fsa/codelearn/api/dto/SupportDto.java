package ma.fsa.codelearn.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.fsa.codelearn.domain.ResourceType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportDto {
  private Long id;
  private ResourceType type;
  private String title;
  private String description;
  private String accessEndpoint;
  private Long courseId;
}
