package com.ead.course.specifications;

import com.ead.course.dto.CourseFilterDTO;
import com.ead.course.enums.CourseLevel;
import com.ead.course.enums.CourseStatus;
import com.ead.course.models.CourseModel;
import org.springframework.data.jpa.domain.Specification;

public class CourseSpec {
    public static Specification<CourseModel> build(CourseFilterDTO courseFilterDTO) {
        return Specification.allOf(
                hasCourseLevel(courseFilterDTO.courseLevel()),
                hasCourseStatus(courseFilterDTO.courseStatus()),
                nameContains(courseFilterDTO.name())
        );
    }

    private static Specification<CourseModel> hasCourseLevel(CourseLevel level) {
        if (level == null) return null;
        return (root, query, cb) -> cb.equal(root.get("courseLevel"), level);
    }

    private static Specification<CourseModel> hasCourseStatus(CourseStatus status) {
        if (status == null) return null;
        return (root, query, cb) -> cb.equal(root.get("courseStatus"), status);
    }

    private static Specification<CourseModel> nameContains(String name) {
        if (name == null || name.isBlank()) return null;
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }
}
