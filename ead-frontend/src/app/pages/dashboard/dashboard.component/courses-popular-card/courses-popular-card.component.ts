import { Component, inject, OnInit, signal } from '@angular/core';
import { CourseService } from '../../../../services/course.service';
import { CourseResponse } from '../../../../interfaces/courses.interface';

import { NgClass } from '@angular/common';

@Component({
  selector: 'app-courses-popular-card',
  imports: [NgClass],
  templateUrl: './courses-popular-card.component.html',
  styleUrl: './courses-popular-card.component.css',
})
export class CoursesPopularCardComponent implements OnInit {
  public courseService = inject(CourseService);
  public courses = signal<CourseResponse[]>([]);

  public ngOnInit(): void {
    this.courseService.getPopularCourses().subscribe((courses) => {
      this.courses.set(courses);
      console.log(this.courses());
    });
  }
}
