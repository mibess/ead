import { Component, inject, OnInit, signal } from '@angular/core';
import { CourseRequest } from '../../../interfaces/courses.interface';
import { CourseService } from '../../../services/course.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BackgroundEffectsComponent } from '../../../shared/background-effects/background-effects.component';
import { HeaderPageComponent } from '../../../shared/header-page/header-page.component';
import { CourseLevel, CourseStatus } from '../../../enums/course.enum';

@Component({
  selector: 'app-courses-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    BackgroundEffectsComponent,
    HeaderPageComponent
  ],
  templateUrl: './courses-edit.page.html',
  styleUrl: './courses-edit.page.css',
})
export class CoursesEditPage implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public courseLevels = Object.values(CourseLevel);
  public courseStatuses = Object.values(CourseStatus);

  public courseForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    imageUrl: ['', [Validators.required]],
    courseStatus: [CourseStatus.IN_PROGRESS, [Validators.required]],
    courseLevel: [CourseLevel.BEGINNER, [Validators.required]],
    userInstructor: ['', [Validators.required]],
  });

  public isSubmitting = false;
  public isDeleting = false;
  public isLoading = signal(true);
  private courseId: string | null = null;

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.loadCourse(this.courseId);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  private loadCourse(id: string): void {
    console.log(id);
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          name: course.name,
          description: course.description,
          imageUrl: course.imageUrl,
          courseStatus: course.courseStatus,
          courseLevel: course.courseLevel,
          userInstructor: course.userInstructor
        });
        this.isLoading.set(false);

      },
      error: (err) => {
        console.error('Error loading course', err);
        this.router.navigate(['/courses']);
      }
    });
  }

  onSubmit() {
    if (this.courseForm.invalid || !this.courseId) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const request: CourseRequest = this.courseForm.value;

    this.courseService.updateCourse(this.courseId, request).subscribe({
      next: () => {
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        console.error('Error updating course', err);
        this.isSubmitting = false;
        // Ideally add toast/notification here
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  deleteCourse() {
    if (!this.courseId || !confirm('Are you sure you want to delete this course?')) {
      return;
    }

    this.isDeleting = true;
    this.courseService.deleteCourse(this.courseId).subscribe({
      next: () => {
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        console.error('Error deleting course', err);
        this.isDeleting = false;
        // Ideally add toast/notification here
      },
      complete: () => {
        this.isDeleting = false;
      }
    });
  }
}
