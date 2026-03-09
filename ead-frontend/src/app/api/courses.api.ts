import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CourseResponse } from '../interfaces/courses.interface';


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

}
