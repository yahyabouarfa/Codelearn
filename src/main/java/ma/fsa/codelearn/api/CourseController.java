package ma.fsa.codelearn.api;

import ma.fsa.codelearn.repo.CourseRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseRepo repo;
    public CourseController(CourseRepo repo){ this.repo = repo; }

    @GetMapping
    public List<CourseDto> all() {
        return repo.findAll()
                .stream()
                .map(c -> new CourseDto(
                        c.getId(),
                        c.getTitre(),
                        c.getDescription(),
                        c.getCreateur().getNom()))
                .toList();
    }
}
