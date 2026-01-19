package com.ead.course.dto;

import com.ead.course.enums.CourseLevel;
import com.ead.course.enums.CourseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CourseDTO {
    @NotBlank
    private String name;

    @NotBlank
    private String description;
    private String imageUrl;

    @NotNull
    private CourseStatus courseStatus;
    @NotNull
    private CourseLevel courseLevel;
    @NotNull
    private UUID userInstructor;
}
