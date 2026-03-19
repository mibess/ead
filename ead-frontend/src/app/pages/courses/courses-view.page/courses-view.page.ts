import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { ModuleService } from '../../../services/module.service';
import { CourseResponse } from '../../../interfaces/courses.interface';
import { ModuleResponse } from '../../../interfaces/modules.interface';
import { BackgroundEffectsComponent } from '../../../shared/background-effects/background-effects.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses-view.page',
  standalone: true,
  imports: [RouterModule, BackgroundEffectsComponent, CommonModule],
  templateUrl: './courses-view.page.html',
  styleUrl: './courses-view.page.css',
})
export class CoursesViewPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly moduleService = inject(ModuleService);

  public course = signal<CourseResponse | null>(null);
  public modules = signal<ModuleResponse[]>([]);
  public isLoading = signal(true);
  public error = signal<string | null>(null);

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.fetchCourseData(courseId);
    } else {
      this.error.set('No course ID provided');
      this.isLoading.set(false);
    }
  }

  private fetchCourseData(courseId: string): void {
    this.isLoading.set(true);
    
    // Fetch course details
    this.courseService.getCourseById(courseId).subscribe({
      next: (courseData) => {
        this.course.set(courseData);
        
        // Fetch modules after successful course fetch
        this.moduleService.getAllModules(courseId).subscribe({
          next: (modulesData) => {
             this.modules.set(modulesData);
             this.isLoading.set(false);
          },
          error: (err) => {
             console.error('Failed to load modules', err);
             // Still works if modules fail, set loading false
             this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Failed to load course details', err);
        this.error.set('Unable to load course details. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }
}
