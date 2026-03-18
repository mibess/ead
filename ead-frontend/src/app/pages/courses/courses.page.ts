import { Component, inject, OnInit, signal } from '@angular/core';
import { Course, CourseService } from '../../services/course.service';
import { BackgroundEffectsComponent } from '../../shared/background-effects/background-effects.component';
import { RouterModule } from '@angular/router';
import { HeaderPageComponent } from "../../shared/header-page/header-page.component";
import { CourseResponse } from '../../interfaces/courses.interface';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [BackgroundEffectsComponent, RouterModule, HeaderPageComponent],
  templateUrl: './courses.page.html',
  styleUrl: './courses.page.css'
})
export class CoursesPage implements OnInit {
  private readonly courseService = inject(CourseService);

  public courses = signal<CourseResponse[]>([]);

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((response) => {
      this.courses.set(response.content);
    });
  }
}
