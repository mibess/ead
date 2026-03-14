import { inject, Injectable } from '@angular/core';
import { LessonsApi } from '../api/lessons.api';
import { LessonRequest, LessonResponse } from '../interfaces/lessons.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private readonly lessonsApi = inject(LessonsApi);

  public getAllLessons(moduleId: string): Observable<LessonResponse[]> {
    return this.lessonsApi.getAllLessons(moduleId);
  }

  public getOneLesson(moduleId: string, lessonId: string): Observable<LessonResponse> {
    return this.lessonsApi.getOneLesson(moduleId, lessonId);
  }

  public createLesson(moduleId: string, lesson: LessonRequest): Observable<LessonResponse> {
    return this.lessonsApi.createLesson(moduleId, lesson);
  }

  public updateLesson(moduleId: string, lessonId: string, lesson: LessonRequest): Observable<LessonResponse> {
    return this.lessonsApi.updateLesson(moduleId, lessonId, lesson);
  }

  public deleteLesson(moduleId: string, lessonId: string): Observable<void> {
    return this.lessonsApi.deleteLesson(moduleId, lessonId);
  }
}
