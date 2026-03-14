import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CourseRequest } from '../../../interfaces/courses.interface';
import { CourseService } from '../../../services/course.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BackgroundEffectsComponent } from '../../../shared/background-effects/background-effects.component';
import { HeaderPageComponent } from '../../../shared/header-page/header-page.component';
import { CourseLevel, CourseStatus } from '../../../enums/course.enum';
import { FormArray } from '@angular/forms';
import { forkJoin, of, Observable } from 'rxjs';
import { switchMap, finalize, debounceTime, filter, tap, catchError, delay } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModuleService } from '../../../services/module.service';
import { ModuleRequest, ModuleResponse } from '../../../interfaces/modules.interface';
import { Input } from '../../../shared/input/input';
import { ButtonComponent } from '../../../shared/button.component/button.component';
import { ToastService } from '../../../services/toast.service';
import { LessonService } from '../../../services/lesson.service';
import { LessonRequest, LessonResponse } from '../../../interfaces/lessons.interface';

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
  private readonly lessonService = inject(LessonService);
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

  public lessonForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    videoUrl: ['', [Validators.required]],
  });

  public isSubmitting = signal(false);
  public isDeleting = signal(false);
  public isLoading = signal(true);
  public openDeleteDialog = signal(false);

  // Lesson state
  public isLessonDialogOpen = signal(false);
  public isSavingLesson = signal(false);
  public selectedModuleIdForLesson = signal<string | null>(null);
  public selectedLessonId = signal<string | null>(null);
  public lessonsByModule = signal<Record<string, LessonResponse[]>>({});

  private courseId: string | null = null;
  private originalModules: ModuleResponse[] = [];

  // Module toggle state
  public expandedModules = signal<Record<number, boolean>>({});

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
                this.lessonsByModule.update(lessons => ({ ...lessons, [res.id]: [] }));
              }
            }),
            catchError(() => of(null))
          );
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  toggleModule(index: number) {
    this.expandedModules.update(state => ({
      ...state,
      [index]: !state[index]
    }));
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

        if (this.originalModules.length > 0) {
          const lessonRequests: { [key: string]: Observable<LessonResponse[]> } = {};
          this.originalModules.forEach(mod => {
            lessonRequests[mod.id] = this.lessonService.getAllLessons(mod.id).pipe(catchError(() => of([])));
          });
          
          forkJoin(lessonRequests).subscribe({
            next: (lessonsDict) => {
              this.lessonsByModule.set(lessonsDict);
              this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
          });
        } else {
          this.isLoading.set(false);
        }
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

  // --- Lesson Management ---
  openLessonDialog(moduleId: string, lesson?: LessonResponse) {
    this.selectedModuleIdForLesson.set(moduleId);
    if (lesson) {
      this.selectedLessonId.set(lesson.id);
      this.lessonForm.patchValue({
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl
      });
    } else {
      this.selectedLessonId.set(null);
      this.lessonForm.reset();
    }
    this.isLessonDialogOpen.set(true);
  }

  closeLessonDialog() {
    this.isLessonDialogOpen.set(false);
    this.selectedModuleIdForLesson.set(null);
    this.selectedLessonId.set(null);
    this.lessonForm.reset();
  }

  saveLesson() {
    if (this.lessonForm.invalid) {
      this.lessonForm.markAllAsTouched();
      return;
    }
    const moduleId = this.selectedModuleIdForLesson();
    if (!moduleId) return;

    this.isSavingLesson.set(true);
    const formValue = this.lessonForm.value;
    const req: LessonRequest = {
      title: formValue.title,
      description: formValue.description,
      videoUrl: formValue.videoUrl
    };

    const lessonId = this.selectedLessonId();
    const action$ = lessonId
      ? this.lessonService.updateLesson(moduleId, lessonId, req)
      : this.lessonService.createLesson(moduleId, req);

    action$.subscribe({
      next: (res) => {
        this.toastService.showSuccess(lessonId ? 'Lesson updated' : 'Lesson created');
        this.refreshLessonsForModule(moduleId);
        this.closeLessonDialog();
        this.isSavingLesson.set(false);
      },
      error: () => {
        this.toastService.showError('Error saving lesson');
        this.isSavingLesson.set(false);
      }
    });
  }

  deleteLesson(moduleId: string, lessonId: string) {
    if (confirm('Are you sure you want to delete this lesson?')) {
      this.lessonService.deleteLesson(moduleId, lessonId).subscribe({
        next: () => {
          this.toastService.showSuccess('Lesson deleted');
          this.refreshLessonsForModule(moduleId);
        },
        error: () => {
          this.toastService.showError('Error deleting lesson');
        }
      });
    }
  }

  private refreshLessonsForModule(moduleId: string) {
    this.lessonService.getAllLessons(moduleId).subscribe({
      next: (lessons) => {
        this.lessonsByModule.update(state => ({
          ...state,
          [moduleId]: lessons
        }));
      }
    });
  }
}
