import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
export class CoursesPage implements OnInit, AfterViewInit, OnDestroy {
  private readonly courseService = inject(CourseService);

  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;
  private observer: IntersectionObserver | null = null;

  public courses = signal<CourseResponse[]>([]);
  public loadingMore = signal<boolean>(false);
  public currentPage = signal<number>(0);
  public hasMore = signal<boolean>(true);
  public isInitialLoad = signal<boolean>(true);

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    if (this.loadingMore() || !this.hasMore()) return;

    this.loadingMore.set(true);

    this.courseService.getCourses(undefined, { page: this.currentPage(), size: 8 }).subscribe({
      next: (response) => {
        if (response.content.length > 0) {
          this.courses.update(courses => [...courses, ...response.content]);
        }

        const isLastPage = response.page.number + 1 >= response.page.totalPages;
        this.hasMore.set(!isLastPage);

        if (!isLastPage) {
          this.currentPage.update(page => page + 1);
        }

        this.loadingMore.set(false);
        this.isInitialLoad.set(false);
      },
      error: (err) => {
        console.error('Failed to load courses', err);
        this.loadingMore.set(false);
        this.isInitialLoad.set(false);
      }
    });
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && this.hasMore() && !this.loadingMore()) {
          this.loadCourses();
        }
      }, { threshold: 0.1 });

      if (this.scrollTrigger?.nativeElement) {
        this.observer.observe(this.scrollTrigger.nativeElement);
      }
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
