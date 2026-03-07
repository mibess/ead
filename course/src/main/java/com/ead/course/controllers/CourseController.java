package com.ead.course.controllers;

import com.ead.course.dto.CourseDTO;
import com.ead.course.models.CourseModel;
import com.ead.course.services.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<Object> saveCourse(@RequestBody @Valid CourseDTO courseDTO){
        var courseModel = new CourseModel();
        BeanUtils.copyProperties(courseDTO, courseModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                courseService.save(courseModel)
        );
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Object> deleteCourse(@PathVariable UUID courseId){
        Optional<CourseModel> courseModelOptional = courseService.findById(courseId);

        if (!courseModelOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found!");
        }

        courseService.delete(courseModelOptional.get());

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Course deleted successfully!");
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<Object> updateCourse(
            @PathVariable UUID courseId,
            @RequestBody @Valid CourseDTO courseDTO) {
        Optional<CourseModel> courseModelOptional = courseService.findById(courseId);

        if (courseModelOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found!");
        }

        var courseModel = courseModelOptional.get();
        BeanUtils.copyProperties(courseDTO, courseModel);


        return ResponseEntity.status(HttpStatus.OK).body(
                courseService.save(courseModel)
        );
    }

    @GetMapping
    public ResponseEntity<List<CourseModel>> getAllCourses(){
        return ResponseEntity.status(HttpStatus.OK).body(courseService.findAll());
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<Object> getOneCourse(@PathVariable UUID courseId) {
        Optional<CourseModel> courseModelOptional = courseService.findById(courseId);

        if (!courseModelOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found!");
        }

        return ResponseEntity.status(HttpStatus.OK).body(courseModelOptional.get());
    }

}
