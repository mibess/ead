import { Component, inject, OnInit, signal } from '@angular/core';
import { Course, CourseService } from '../../services/course.service';
import { BackgroundEffectsComponent } from '../../shared/background-effects/background-effects.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [BackgroundEffectsComponent, RouterModule],
  templateUrl: './courses.page.html',
  styleUrl: './courses.page.css'
})
export class CoursesPage implements OnInit {
  private readonly courseService = inject(CourseService);

  public courses = signal<Course[]>([]);

  ngOnInit(): void {
    this.courseService.getMockCourses(10).subscribe(data => {
      this.courses.set(data);
    });
  }
}
