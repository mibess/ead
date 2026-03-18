package com.ead.course.services;

import com.ead.course.dto.CourseFilterDTO;
import com.ead.course.models.CourseModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseService {
    CourseModel save(CourseModel course);
    void delete(CourseModel course);
    Optional<CourseModel> findById(UUID courseId);
    Page<CourseModel> findAll(CourseFilterDTO courseFilterDTO, Pageable pageable);
    List<CourseModel> findPopularCourses();
}
