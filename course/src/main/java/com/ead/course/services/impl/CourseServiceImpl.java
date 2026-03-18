package com.ead.course.services.impl;

import com.ead.course.dto.CourseFilterDTO;
import com.ead.course.models.CourseModel;
import com.ead.course.models.LessonModel;
import com.ead.course.models.ModuleModel;
import com.ead.course.repositories.CourseRepository;
import com.ead.course.repositories.LessonRepository;
import com.ead.course.repositories.ModuleRepository;
import com.ead.course.services.CourseService;
import com.ead.course.specifications.CourseSpec;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    @Transactional
    @Override
    public CourseModel save(CourseModel course) {
        return courseRepository.save(course);
    }

    @Transactional
    @Override
    public void delete(CourseModel course) {
        List<ModuleModel> moduleModelList = moduleRepository.findAllByCourseId(course.getId());

        if (!moduleModelList.isEmpty()) {
            for (ModuleModel module : moduleModelList) {
                List<LessonModel> lessonModelList = lessonRepository.findAllByModuleId(module.getId());
                if (!lessonModelList.isEmpty()) {
                    lessonRepository.deleteAll(lessonModelList);
                }
            }
        }
        moduleRepository.deleteAll(course.getModules());
        courseRepository.delete(course);
    }

    @Override
    public Optional<CourseModel> findById(UUID courseId) {
        return courseRepository.findById(courseId);
    }

    @Override
    public Page<CourseModel> findAll(CourseFilterDTO courseFilterDTO, Pageable pageable) {
        Specification<CourseModel> spec = CourseSpec.build(courseFilterDTO);
        return courseRepository.findAll(spec, pageable);
    }

    @Override
    public List<CourseModel> findPopularCourses() {
        return courseRepository.getPopularCourses();
    }
}
