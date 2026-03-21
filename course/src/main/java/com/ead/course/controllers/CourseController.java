package com.ead.course.controllers;

import com.ead.course.dto.CourseDTO;
import com.ead.course.dto.CourseFilterDTO;
import com.ead.course.models.CourseModel;
import com.ead.course.models.ModuleModel;
import com.ead.course.services.CourseService;
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

import java.util.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/courses")
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
    public ResponseEntity<Page<CourseModel>> getAllCourses(
            CourseFilterDTO courseFilterDTO,
            @PageableDefault(page = 0, size = 8, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
            ){
        return ResponseEntity.ok().body(
                courseService.findAll(courseFilterDTO, pageable)
        );
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<Object> getOneCourse(@PathVariable UUID courseId) {
        Optional<CourseModel> courseModelOptional = courseService.findById(courseId);

        if (!courseModelOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found!");
        }

        var course = courseModelOptional.get();

        return ResponseEntity.status(HttpStatus.OK).body(course);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<CourseModel>> getPopularCourses() {
        List<CourseModel> courses = courseService.findPopularCourses();
        return ResponseEntity.status(HttpStatus.OK).body(courses);
    }

}
