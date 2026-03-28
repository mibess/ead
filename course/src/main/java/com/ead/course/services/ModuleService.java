package com.ead.course.services;

import com.ead.course.dto.ModuleFilterDTO;
import com.ead.course.models.ModuleModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ModuleService {
    List<ModuleModel> getAll(UUID courseId);
    Page<ModuleModel> getAll(UUID courseId, ModuleFilterDTO moduleFilterDTO, Pageable pageable);

    void delete(ModuleModel module);

    ModuleModel save(ModuleModel moduleModel);

    Optional<ModuleModel> findModuleIntoCourse(UUID courseId, UUID moduleId);

    void deleteModule(UUID courseId, UUID moduleId);

    Optional<ModuleModel> findById(UUID moduleId);
}

