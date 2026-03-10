import { Component, inject } from '@angular/core';
import { CourseRequest } from '../../../interfaces/courses.interface';
import { CourseService } from '../../../services/course.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BackgroundEffectsComponent } from '../../../shared/background-effects/background-effects.component';
import { HeaderPageComponent } from '../../../shared/header-page/header-page.component';
import { CourseLevel, CourseStatus } from '../../../enums/course.enum';
import { ModuleService } from '../../../services/module.service';
import { ModuleRequest } from '../../../interfaces/modules.interface';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Input } from '../../../shared/input/input';
import { ButtonComponent } from '../../../shared/button.component/button.component';
@Component({
  selector: 'app-courses-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    BackgroundEffectsComponent,
    HeaderPageComponent,
    Input,
    ButtonComponent
  ],
  templateUrl: './courses-new.page.html',
  styleUrl: './courses-new.page.css',
})
export class CoursesNewPage {
  private readonly courseService = inject(CourseService);
  private readonly moduleService = inject(ModuleService);
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
    modules: this.fb.array([])
  });

  get modules() {
    return this.courseForm.get('modules') as import('@angular/forms').FormArray;
  }

  addModule() {
    this.modules.push(
      this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]]
      })
    );
  }

  removeModule(index: number) {
    this.modules.removeAt(index);
  }

  public isSubmitting = false;

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.courseForm.value;
    const request: CourseRequest = {
      name: formValue.name,
      description: formValue.description,
      imageUrl: formValue.imageUrl,
      courseStatus: formValue.courseStatus,
      courseLevel: formValue.courseLevel,
      userInstructor: formValue.userInstructor,
    };

    const modulesData: ModuleRequest[] = formValue.modules || [];

    this.courseService.createCourse(request).pipe(
      switchMap(course => {
        if (modulesData.length === 0) {
          // Wrap course in an array to match forkJoin behavior if we wanted to
          // For consistency in returned type, we might just map it, but since we 
          // need the course id in the next step, we can just return it.
          // Since moduleRequests returns an array of responses, let's map to an object
          return of({ course, modules: [] });
        }
        const moduleRequests = modulesData.map(mod => this.moduleService.createModule(course.id, mod));
        return forkJoin(moduleRequests).pipe(switchMap(modules => of({ course, modules })));
      })
    ).subscribe({
      next: ({ course }) => {
        this.router.navigate(['/courses', course.id, 'edit']);
      },
      error: (err) => {
        console.error('Error creating course or modules', err);
        this.isSubmitting = false;
        // Ideally add toast/notification here
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
