package com.ead.course.controllers;

import com.ead.course.dto.ModuleDTO;
import com.ead.course.dto.ModuleFilterDTO;
import com.ead.course.models.ModuleModel;
import com.ead.course.services.CourseService;
import com.ead.course.services.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/courses/{courseId}/modules")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;
    private final CourseService courseService;

    @GetMapping("/simple-study")
    public ResponseEntity<List<ModuleModel>> getAllModules(@PathVariable UUID courseId){
        return ResponseEntity.status(HttpStatus.OK).body(moduleService.getAll(courseId));
    }

    @GetMapping
    public ResponseEntity<Page<ModuleModel>> getAllModulesWithPageable(
            @PathVariable UUID courseId,
            ModuleFilterDTO moduleFilterDTO,
            @PageableDefault(page = 0, size = 10, sort = "title", direction = Sort.Direction.ASC) Pageable pageable
            ){
        return ResponseEntity.status(HttpStatus.OK).body(
                moduleService.getAll(courseId, moduleFilterDTO, pageable)
        );
    }

    @GetMapping("{moduleId}")
    public ResponseEntity<Object> getOneModule(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId){

        var moduleModel = moduleService.findModuleIntoCourse(courseId, moduleId);

        if (moduleModel.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Module not found!");
        }
        return ResponseEntity.status(HttpStatus.OK).body(moduleModel.get());
    }

    @PostMapping
    public ResponseEntity<Object> saveModule(
            @PathVariable UUID courseId,
            @RequestBody @Valid ModuleDTO moduleDTO){
        var course = courseService.findById(courseId);

        if (course.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found!");
        }

        var moduleModel = new ModuleModel();
        BeanUtils.copyProperties(moduleDTO, moduleModel);
        moduleModel.setCourse(course.get());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                moduleService.save(moduleModel)
        );
    }

    @PutMapping("{moduleId}")
    public ResponseEntity<Object> updateModule(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId,
            @RequestBody @Valid ModuleDTO moduleDTO){
        var moduleModel = moduleService.findModuleIntoCourse(courseId, moduleId);

        if (moduleModel.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Module not found for this course!");
        }

        var module = moduleModel.get();

        module.setTitle(moduleDTO.getTitle());
        module.setDescription(moduleDTO.getDescription());

        return ResponseEntity.status(HttpStatus.OK).body(
                moduleService.save(module)
        );
    }


    @DeleteMapping("{moduleId}")
    public ResponseEntity<Object> deleteModule(
            @PathVariable UUID courseId,
            @PathVariable UUID moduleId){

        moduleService.deleteModule(courseId, moduleId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
