import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackgroundEffectsComponent } from "../../../shared/background-effects/background-effects.component";
import { Course, CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-dashboard.page',
  standalone: true,
  imports: [RouterModule, BackgroundEffectsComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  private readonly route = inject(Router);
  private readonly courseService = inject(CourseService);

  public userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn') || '{}');
  public isSidebarOpen = false;

  public recommendedCourses = signal<Course[]>([]);

  constructor() {
    this.courseService.getMockCourses(5).subscribe(courses => {
      this.recommendedCourses.set(courses);
    });
  }

  public toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  public closeSidebar() {
    this.isSidebarOpen = false;
  }

  public logout() {
    localStorage.removeItem('userLoggedIn');
    this.route.navigate(['/']);
  }
}
