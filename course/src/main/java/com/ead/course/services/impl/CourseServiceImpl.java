package com.ead.course.services.impl;

import com.ead.course.models.CourseModel;
import com.ead.course.models.LessonModel;
import com.ead.course.models.ModuleModel;
import com.ead.course.repositories.CourseRepository;
import com.ead.course.repositories.LessonRepository;
import com.ead.course.repositories.ModuleRepository;
import com.ead.course.services.CourseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    @Transactional
    @Override
    public void delete(CourseModel course) {
        List<ModuleModel> moduleModelList = moduleRepository.findAllByCourseId(course.getCourseId());

        if (moduleModelList.isEmpty()) {
            return;
        }

        for (ModuleModel module : moduleModelList) {
            List<LessonModel> lessonModelList = lessonRepository.findAllByModuleId(module.getModuleId());
            if (!lessonModelList.isEmpty()) {
                lessonRepository.deleteAll(lessonModelList);
            }
            moduleRepository.delete(module);
        }
    }

}
