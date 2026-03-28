package com.ead.course.specifications;

import com.ead.course.dto.ModuleFilterDTO;
import com.ead.course.models.CourseModel;
import com.ead.course.models.ModuleModel;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collection;
import java.util.UUID;

public class ModuleSpec {
    public static Specification<ModuleModel> build(ModuleFilterDTO moduleFilterDTO) {
        return Specification.allOf(
                titleContains(moduleFilterDTO.title())
        );
    }

    private static Specification<ModuleModel> titleContains(String title) {
        if (title == null || title.isBlank()) return null;
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<ModuleModel> moduleCourseId(final UUID id){
        return (root, query, cb) -> {
            query.distinct(true);
            Root<ModuleModel> module = root;
            Root<CourseModel> course = query.from(CourseModel.class);
            Expression<Collection<ModuleModel>> courseModules = course.get("modules");
            return cb.and(cb.equal(course.get("id"), id), cb.isMember(module, courseModules));
        };
    }
}
