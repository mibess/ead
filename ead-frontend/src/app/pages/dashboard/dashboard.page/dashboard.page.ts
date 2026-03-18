import { Component, HostListener, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackgroundEffectsComponent } from "../../../shared/background-effects/background-effects.component";
import { Course, CourseService } from '../../../services/course.service';
import { CourseResponse, Page } from '../../../interfaces/courses.interface';
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
  public searchResults = signal<CourseResponse[]>([]);
  public isLoadingSearch = signal(false);
  public searchQuery = signal('');
  
  // Pagination 
  public searchPageNumber = signal(0);
  public searchTotalPages = signal(0);

  // Keyboard Navigation
  public selectedIndex = signal(-1);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
      return;
    }

    if (this.isSearchDialogOpen()) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.navigateSelection(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.navigateSelection(-1);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        this.selectCurrentCourse();
      }
    }
  }

  private navigateSelection(direction: number) {
    const totalResults = this.searchResults().length;
    if (totalResults === 0) return;

    const currentIndex = this.selectedIndex();
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      nextIndex = totalResults - 1; // Wrap around to bottom
    } else if (nextIndex >= totalResults) {
      nextIndex = 0; // Wrap around to top
    }

    this.selectedIndex.set(nextIndex);
  }

  private selectCurrentCourse() {
    const currentIndex = this.selectedIndex();
    if (currentIndex >= 0 && currentIndex < this.searchResults().length) {
      const selectedCourse = this.searchResults()[currentIndex];
      // Close search and navigate
      this.closeSearch();
      this.route.navigate(['/courses']); // or navigate to specific course if you have the route
    }
  }

  public openSearch() {
    this.isSearchDialogOpen.set(true);
    // Focus input after rendering
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
    this.searchQuery.set('');
    this.fetchCourses(0);
  }

  public onSearchInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchQuery.set(input);
    this.fetchCourses(0);
  }

  public fetchCourses(page: number) {
    this.isLoadingSearch.set(true);
    // Reset selection when fetching new data
    this.selectedIndex.set(-1);
    
    // Build filter
    const filter = this.searchQuery() ? { name: this.searchQuery() } : {};
    
    this.courseService.getCourses(filter, { page: page, size: 5, sort: 'name', direction: 'ASC' }).subscribe({
      next: (response: Page<CourseResponse>) => {
        this.searchResults.set(response.content);
        this.searchPageNumber.set(response.page.number);
        this.searchTotalPages.set(response.page.totalPages);
      },
      error: () => {
        // Handle error gracefully if needed
      },
      complete: () => {
        this.isLoadingSearch.set(false);
      }
    });
  }

  public nextPage() {
    if (this.searchPageNumber() < this.searchTotalPages() - 1) {
      this.fetchCourses(this.searchPageNumber() + 1);
    }
  }

  public prevPage() {
    if (this.searchPageNumber() > 0) {
      this.fetchCourses(this.searchPageNumber() - 1);
    }
  }

  public closeSearch() {
    this.isSearchDialogOpen.set(false);
    this.searchQuery.set('');
  }
}
