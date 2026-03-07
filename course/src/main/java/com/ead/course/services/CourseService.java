package com.ead.course.services;

import com.ead.course.models.CourseModel;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseService {
    CourseModel save(CourseModel couse);
    void delete(CourseModel course);
    Optional<CourseModel> findById(UUID courseId);
    List<CourseModel> findAll();

    List<CourseModel> findPopularCourses();
}
