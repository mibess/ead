package com.ead.course.controllers;

import com.ead.course.dto.CourseDTO;
import com.ead.course.dto.LessonDTO;
import com.ead.course.models.CourseModel;
import com.ead.course.models.LessonModel;
import com.ead.course.services.LessonService;
import com.ead.course.services.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("modules/{moduleId}/lessons")
@RequiredArgsConstructor
public class LessonController {
    private final LessonService lessonService;
    private final ModuleService moduleService;

    @PostMapping
    public ResponseEntity<Object> saveLesson(
            @PathVariable UUID moduleId,
            @RequestBody @Valid LessonDTO lessonDTO){

        var module = moduleService.findById(moduleId);
        if (module.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("This module not exist!");
        }

        var lessonModel = new LessonModel();
        BeanUtils.copyProperties(lessonDTO, lessonModel);
        lessonModel.setModule(module.get());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                lessonService.save(lessonModel)
        );
    }

    @DeleteMapping("{lessonId}")
    public ResponseEntity<Object> deleteLesson(
            @PathVariable UUID moduleId,
            @PathVariable UUID lessonId){

        var lesson = lessonService.findLessonIntoModule(moduleId, lessonId);
        if (lesson.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("This lesson not exist for this module!");
        }

        lessonService.deleteLesson(lesson.get());

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Lesson deleted successfully!");
    }

    @PutMapping("{lessonId}")
    public ResponseEntity<Object> updateLesson(
            @PathVariable UUID moduleId,
            @PathVariable UUID lessonId,
            @RequestBody @Valid LessonDTO lessonDTO){

        var lessonModel = lessonService.findLessonIntoModule(moduleId, lessonId);
        if (lessonModel.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("This lesson not exist for this module!");
        }

        var lesson = lessonModel.get();

        lesson.setTitle(lessonDTO.getTitle());
        lesson.setDescription(lessonDTO.getDescription());
        lesson.setVideoUrl(lessonDTO.getVideoUrl());

        return ResponseEntity.status(HttpStatus.CREATED).body(
                lessonService.save(lesson)
        );
    }

    @GetMapping
    public ResponseEntity<List<LessonModel>> getAllLessons(@PathVariable UUID moduleId){
        return ResponseEntity.status(HttpStatus.OK).body(lessonService.getAll(moduleId));
    }

    @GetMapping("{lessonId}")
    public ResponseEntity<Object> getOneLesson(
            @PathVariable UUID moduleId,
            @PathVariable UUID lessonId){

        var lessonModel = lessonService.findLessonIntoModule(moduleId, lessonId);
        if (lessonModel.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("This lesson not exist for this module!");
        }

        var lesson = lessonModel.get();

        return ResponseEntity.status(HttpStatus.OK).body(lesson);
    }
}
