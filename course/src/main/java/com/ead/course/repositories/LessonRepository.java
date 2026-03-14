package com.ead.course.repositories;

import com.ead.course.models.LessonModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<LessonModel, UUID> {

    List<LessonModel> findAllByModuleId(UUID moduleId);

    Optional<LessonModel> findLessonByModuleIdAndId(UUID moduleId, UUID lessonId);
}
