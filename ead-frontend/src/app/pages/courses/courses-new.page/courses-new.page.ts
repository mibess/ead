import { Component, inject } from '@angular/core';
import { CourseRequest } from '../../../interfaces/courses.interface';
import { CourseService } from '../../../services/course.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BackgroundEffectsComponent } from '../../../shared/background-effects/background-effects.component';
import { HeaderPageComponent } from '../../../shared/header-page/header-page.component';
import { CourseLevel, CourseStatus } from '../../../enums/course.enum';

@Component({
  selector: 'app-courses-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    BackgroundEffectsComponent,
    HeaderPageComponent
  ],
  templateUrl: './courses-new.page.html',
  styleUrl: './courses-new.page.css',
})
export class CoursesNewPage {
  private readonly courseService = inject(CourseService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

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

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const request: CourseRequest = this.courseForm.value;

    this.courseService.createCourse(request).subscribe({
      next: () => {
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        console.error('Error creating course', err);
        this.isSubmitting = false;
        // Ideally add toast/notification here
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
