import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CourseRequest, CourseResponse } from '../interfaces/courses.interface';
import { ModuleRequest, ModuleResponse } from '../interfaces/modules.interface';


@Injectable({
  providedIn: 'root'
})
export class ModulesApi {
  private readonly apiBaseUrl: string = environment.API_COURSE_BASE_URL + '/courses';
  private readonly http = inject(HttpClient);

  public getAllModules(courseId: string): Observable<ModuleResponse[]> {
    return this.http.get<ModuleResponse[]>(`${this.apiBaseUrl}/${courseId}/modules`);
  }

  public createModule(courseId: string, module: ModuleRequest): Observable<ModuleResponse> {
    return this.http.post<ModuleResponse>(`${this.apiBaseUrl}/${courseId}/modules`, module);
  }

  public updateModule(courseId: string, moduleId: string, module: ModuleRequest): Observable<ModuleResponse> {
    return this.http.put<ModuleResponse>(`${this.apiBaseUrl}/${courseId}/modules/${moduleId}`, module);
  }

  public deleteModule(courseId: string, moduleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${courseId}/modules/${moduleId}`);
  }
}