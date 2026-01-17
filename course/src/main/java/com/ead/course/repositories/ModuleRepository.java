package com.ead.course.repositories;

import com.ead.course.models.ModuleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ModuleRepository extends JpaRepository<ModuleModel, UUID> {
    // to study
//    @EntityGraph(attributePaths = {"course"})
//    ModuleModel findByTitle(String title);

    List<ModuleModel> findAllByCourseId(UUID courseId);

    @Query(value = "select * from tb_modules where course_id = :courseId", nativeQuery = true)
    List<ModuleModel> findAllModulesIntoCourse(UUID courseId);

    // to study
    @Modifying
    @Query(value = "update tb_modules set course_id = :courseId where id = :moduleId")
    ModuleModel updateModule(UUID courseId, UUID moduleId);

    // to study
    @Modifying
    @Query(value = "delete from tb_modules where id = :moduleId")
    void delete(UUID moduleId);
}
