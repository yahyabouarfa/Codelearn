package ma.fsa.codelearn.api.dto;

import java.time.Instant;
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
public class ModuleProgressDto {
  private Long courseId;
  private Long moduleId;
  private Long apprenantId;
  private Instant completedAt;
}
