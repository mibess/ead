import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CourseRequest, CourseResponse, Page, CourseFilter, PageableOptions } from '../interfaces/courses.interface';


@Injectable({
  providedIn: 'root'
})
export class CoursesApi {
  private readonly apiBaseUrl: string = environment.API_COURSE_BASE_URL + '/courses';
  private readonly http = inject(HttpClient);

  public getPopularCourses(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(`${this.apiBaseUrl}/popular`);
  }

  public getCourses(filter?: CourseFilter, pageable?: PageableOptions): Observable<Page<CourseResponse>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.name) params = params.set('name', filter.name);
      if (filter.courseLevel) params = params.set('courseLevel', filter.courseLevel.toString());
      if (filter.courseStatus) params = params.set('courseStatus', filter.courseStatus.toString());
    }

    if (pageable) {
      if (pageable.page !== undefined) params = params.set('page', pageable.page);
      if (pageable.size !== undefined) params = params.set('size', pageable.size);
      if (pageable.sort) params = params.set('sort', pageable.sort);
      if (pageable.direction) params = params.set('direction', pageable.direction);
    }

    return this.http.get<Page<CourseResponse>>(`${this.apiBaseUrl}`, { params });
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
