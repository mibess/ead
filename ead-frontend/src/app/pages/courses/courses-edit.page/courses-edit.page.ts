import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CourseRequest } from '../../../interfaces/courses.interface';
import { CourseService } from '../../../services/course.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BackgroundEffectsComponent } from '../../../shared/background-effects/background-effects.component';
import { HeaderPageComponent } from '../../../shared/header-page/header-page.component';
import { CourseLevel, CourseStatus } from '../../../enums/course.enum';
import { FormArray } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap, finalize, debounceTime, filter, tap, catchError, delay } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModuleService } from '../../../services/module.service';
import { ModuleRequest, ModuleResponse } from '../../../interfaces/modules.interface';
import { Input } from '../../../shared/input/input';
import { ButtonComponent } from '../../../shared/button.component/button.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-courses-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    BackgroundEffectsComponent,
    HeaderPageComponent,
    Input,
    ButtonComponent
  ],
  templateUrl: './courses-edit.page.html',
  styleUrl: './courses-edit.page.css',
})
export class CoursesEditPage implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly moduleService = inject(ModuleService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  public courseLevels = Object.values(CourseLevel);
  public courseStatuses = Object.values(CourseStatus);

  public courseForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    imageUrl: ['', [Validators.required]],
    courseStatus: [CourseStatus.IN_PROGRESS, [Validators.required]],
    courseLevel: [CourseLevel.BEGINNER, [Validators.required]],
    userInstructor: ['', [Validators.required]],
    modules: this.fb.array([]),
  });

  public isSubmitting = signal(false);
  public isDeleting = signal(false);
  public isLoading = signal(true);
  public openDeleteDialog = signal(false);
  private courseId: string | null = null;
  private originalModules: ModuleResponse[] = [];

  get modules() {
    return this.courseForm.get('modules') as FormArray;
  }

  addModule(module?: ModuleResponse) {
    const moduleGroup = this.fb.group({
      id: [module?.id || null],
      title: [module?.title || '', [Validators.required]],
      description: [module?.description || '', [Validators.required]]
    });

    this.modules.push(moduleGroup);

    // Auto-save logic
    moduleGroup.valueChanges.pipe(
      debounceTime(1000),
      filter(() => moduleGroup.valid && !!this.courseId),
      switchMap((value) => {
        const req: ModuleRequest = { title: value.title || '', description: value.description || '' };
        const id = moduleGroup.get('id')?.value;
        if (id) {
          return this.moduleService.updateModule(this.courseId!, id, req).pipe(catchError(() => of(null)));
        } else {
          return this.moduleService.createModule(this.courseId!, req).pipe(
            tap(res => {
              if (res && res.id) {
                moduleGroup.get('id')?.setValue(res.id, { emitEvent: false });
                this.originalModules.push(res);
              }
            }),
            catchError(() => of(null))
          );
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  removeModule(index: number) {
    const moduleGroup = this.modules.at(index);
    const id = moduleGroup.get('id')?.value;

    if (id && this.courseId) {
      this.moduleService.deleteModule(this.courseId, id).subscribe({
        next: () => {
          this.toastService.showSuccess('Module deleted');
          this.originalModules = this.originalModules.filter(m => m.id !== id);
        },
        error: (err) => {
          console.error('Error auto-deleting module', err);
          this.toastService.showError('Error deleting module');
        }
      });
    }

    this.modules.removeAt(index);
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.loadCourse(this.courseId);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  private loadCourse(id: string): void {
    forkJoin({
      course: this.courseService.getCourseById(id),
      modules: this.moduleService.getAllModules(id)
    }).subscribe({
      next: ({ course, modules }) => {
        this.courseForm.patchValue({
          name: course.name,
          description: course.description,
          imageUrl: course.imageUrl,
          courseStatus: course.courseStatus,
          courseLevel: course.courseLevel,
          userInstructor: course.userInstructor
        });

        this.originalModules = modules || [];
        // Clear existing modules form array
        while (this.modules.length !== 0) {
          this.modules.removeAt(0);
        }

        this.originalModules.forEach(mod => this.addModule(mod));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading course or modules', err);
        this.router.navigate(['/courses']);
      }
    });
  }

  onSubmit() {
    if (this.courseForm.invalid || !this.courseId) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.courseForm.value;
    const request: CourseRequest = {
      name: formValue.name,
      description: formValue.description,
      imageUrl: formValue.imageUrl,
      courseStatus: formValue.courseStatus,
      courseLevel: formValue.courseLevel,
      userInstructor: formValue.userInstructor,
    };

    // Since modules are auto-saved, we only handle any unsaved modules (no ID yet)
    // just in case the user clicks "Save" before the debounce completes.
    const currentModules: any[] = formValue.modules || [];

    const modulesToCreate = currentModules
      .filter(m => !m.id && m.title && m.description)
      .map(m => {
        const modReq: ModuleRequest = { title: m.title, description: m.description };
        return this.moduleService.createModule(this.courseId!, modReq);
      });

    this.courseService.updateCourse(this.courseId, request).pipe(
      delay(1500),
      switchMap(() => {
        if (modulesToCreate.length === 0) {
          return of(null);
        }
        return forkJoin(modulesToCreate);
      })
    ).subscribe({
      next: () => {
        this.toastService.showSuccess('Course updated successfully');
        this.router.navigate(['/courses', this.courseId, 'edit']);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Error updating course or modules', err);
        this.toastService.showError('Error updating course. Please try again.');
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  deleteCourse() {
    if (!this.courseId) return;
    this.openDeleteDialog.set(true);
  }

  closeDeleteDialog() {
    this.openDeleteDialog.set(false);
  }

  confirmDeleteCourse() {
    if (!this.courseId) return;

    this.isDeleting.set(true);
    this.courseService.deleteCourse(this.courseId).subscribe({
      next: () => {
        this.toastService.showSuccess('Course deleted successfully');
        this.openDeleteDialog.set(false);
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        console.error('Error deleting course', err);
        this.toastService.showError('Error deleting course. Please try again.');
        this.isDeleting.set(false);
      },
      complete: () => {
        this.isDeleting.set(false);
      }
    });
  }
}
