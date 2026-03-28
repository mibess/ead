package com.ead.course.services.impl;

import com.ead.course.dto.ModuleFilterDTO;
import com.ead.course.models.LessonModel;
import com.ead.course.models.ModuleModel;
import com.ead.course.repositories.LessonRepository;
import com.ead.course.repositories.ModuleRepository;
import com.ead.course.services.ModuleService;
import com.ead.course.specifications.ModuleSpec;
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
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    public List<ModuleModel> getAll(UUID courseId){
        return moduleRepository.findAllByCourseId(courseId);
    }

    public Page<ModuleModel> getAll(UUID courseId, ModuleFilterDTO moduleFilterDTO, Pageable pageable){
        Specification<ModuleModel> spec = ModuleSpec.build(moduleFilterDTO);

        spec = spec.and(ModuleSpec.moduleCourseId(courseId));

        return moduleRepository.findAll(spec, pageable);
    }

    @Transactional
    @Override
    public ModuleModel save(ModuleModel module) {
        return moduleRepository.save(module);
    }

    @Transactional
    @Override
    public void delete(ModuleModel module) {
        List<LessonModel> lessonModelList = lessonRepository.findAllByModuleId(module.getId());
        if (!lessonModelList.isEmpty()) {
            lessonRepository.deleteAll(lessonModelList);
        }

        moduleRepository.delete(module);
    }

    @Transactional
    @Override
    public void deleteModule(UUID courseId, UUID moduleId) {
        var model = moduleRepository.findModuleByCourseIdAndId(courseId, moduleId);

        if (model.isEmpty()){
            return;
        }

        this.delete(model.get());
    }

    public Optional<ModuleModel> findModuleIntoCourse(UUID courseId, UUID moduleId){
        return moduleRepository.findModuleByCourseIdAndId(courseId, moduleId);
    }

    public Optional<ModuleModel> findById(UUID moduleId){
        return moduleRepository.findById(moduleId);
    }



}
