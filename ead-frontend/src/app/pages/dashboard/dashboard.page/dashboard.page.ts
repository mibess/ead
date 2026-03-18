import { Component, HostListener, inject, signal, ViewChild, ElementRef } from '@angular/core';
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

  public isSearchDialogOpen = signal(false);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }

  public openSearch() {
    this.isSearchDialogOpen.set(true);
    // Focus input after rendering
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
  }

  public closeSearch() {
    this.isSearchDialogOpen.set(false);
  }
}
