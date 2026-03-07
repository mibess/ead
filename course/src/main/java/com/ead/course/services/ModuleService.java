package com.ead.course.services;

import com.ead.course.models.ModuleModel;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ModuleService {
    List<ModuleModel> getAll(UUID courseId);

    void delete(ModuleModel module);

    ModuleModel save(ModuleModel moduleModel);

    Optional<ModuleModel> findModuleIntoCourse(UUID courseId, UUID moduleId);

    void deleteModule(UUID courseId, UUID moduleId);
}

