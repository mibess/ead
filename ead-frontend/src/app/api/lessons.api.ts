import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ModuleRequest, ModuleResponse } from '../interfaces/modules.interface';
import { LessonRequest, LessonResponse } from '../interfaces/lessons.interface';


@Injectable({
  providedIn: 'root'
})
export class LessonsApi {
  private readonly apiBaseUrl: string = environment.API_COURSE_BASE_URL + '/modules';
  private readonly http = inject(HttpClient);

  public getAllLessons(moduleId: string): Observable<LessonResponse[]> {
    return this.http.get<LessonResponse[]>(`${this.apiBaseUrl}/${moduleId}/lessons`);
  }

  public getOneLesson(moduleId: string, lessonId: string): Observable<LessonResponse> {
    return this.http.get<LessonResponse>(`${this.apiBaseUrl}/${moduleId}/lessons/${lessonId}`);
  }

  public createLesson(moduleId: string, lesson: LessonRequest): Observable<LessonResponse> {
    return this.http.post<LessonResponse>(`${this.apiBaseUrl}/${moduleId}/lessons`, lesson);
  }

  public updateLesson(moduleId: string, lessonId: string, lesson: LessonRequest): Observable<LessonResponse> {
    return this.http.put<LessonResponse>(`${this.apiBaseUrl}/${moduleId}/lessons/${lessonId}`, lesson);
  }

  public deleteLesson(moduleId: string, lessonId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${moduleId}/lessons/${lessonId}`);
  }
}