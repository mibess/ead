package com.ead.course.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModuleDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String description;
}
