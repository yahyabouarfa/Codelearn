package ma.fsa.codelearn.api.dto;

import java.time.Instant;
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
public class SupportAccessDto {
  private Long supportId;
  private ResourceType type;
  private String temporaryUrl;
  private Instant expiresAt;
}
