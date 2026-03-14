package com.ead.course.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonDTO {
    @NotBlank
    private String title;
    private String description;
    @NotBlank
    private String videoUrl;
}
