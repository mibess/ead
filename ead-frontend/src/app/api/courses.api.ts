import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CourseRequest, CourseResponse } from '../interfaces/courses.interface';


@Injectable({
  providedIn: 'root'
})
export class CoursesApi {
  private readonly apiBaseUrl: string = environment.API_COURSE_BASE_URL + '/courses';
  private readonly http = inject(HttpClient);

  public getPopularCourses(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(`${this.apiBaseUrl}/popular`);
  }

  public getCourses(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(`${this.apiBaseUrl}`);
  }

  public createCourse(course: CourseRequest): Observable<CourseResponse> {
    return this.http.post<CourseResponse>(`${this.apiBaseUrl}`, course);
  }

  public getCourseById(id: string): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.apiBaseUrl}/${id}`);
  }

  public updateCourse(id: string, course: CourseRequest): Observable<CourseResponse> {
    return this.http.put<CourseResponse>(`${this.apiBaseUrl}/${id}`, course);
  }

  public deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`);
  }

}
