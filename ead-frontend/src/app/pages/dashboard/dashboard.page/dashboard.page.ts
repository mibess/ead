import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackgroundEffectsComponent } from "../../../shared/background-effects/background-effects.component";
import { Course, CourseService } from '../../../services/course.service';
import { UserStorageService } from '../../../storage/user-storage.service';
import { UsersSelectors } from '../../users/user.selectors';

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
  private readonly userStorageService = inject(UserStorageService);

  public userSelectors = inject(UsersSelectors);

  public userLoggedIn = this.userStorageService.getUserLoggedIn();
  public userSession = this.userSelectors.userSession();

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
    this.userStorageService.removeUserLoggedIn();
    this.route.navigate(['/']);
  }
}
