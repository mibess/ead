package com.ead.course.specifications;

import com.ead.course.dto.LessonFilterDTO;
import com.ead.course.models.LessonModel;
import org.springframework.data.jpa.domain.Specification;

public class LessonSpec {
    public static Specification<LessonModel> build(LessonFilterDTO lessonFilterDTO) {
        return Specification.allOf(
                titleContains(lessonFilterDTO.title())
        );
    }

    private static Specification<LessonModel> titleContains(String title) {
        if (title == null || title.isBlank()) return null;
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }
}
