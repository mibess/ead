package com.ead.course.dto;

import com.ead.course.enums.CourseLevel;
import com.ead.course.enums.CourseStatus;

public record CourseFilterDTO(CourseLevel courseLevel, CourseStatus courseStatus, String name) {
}
