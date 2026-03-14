import { inject, Injectable } from '@angular/core';
import { ModulesApi } from '../api/modules.api';
import { Observable } from 'rxjs';
import { ModuleRequest, ModuleResponse } from '../interfaces/modules.interface';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private readonly modulesApi = inject(ModulesApi);

  public getAllModules(courseId: string): Observable<ModuleResponse[]> {
    return this.modulesApi.getAllModules(courseId);
  }

  public createModule(courseId: string, module: ModuleRequest): Observable<ModuleResponse> {
    return this.modulesApi.createModule(courseId, module);
  }

  public updateModule(courseId: string, moduleId: string, module: ModuleRequest): Observable<ModuleResponse> {
    return this.modulesApi.updateModule(courseId, moduleId, module);
  }

  public deleteModule(courseId: string, moduleId: string): Observable<void> {
    return this.modulesApi.deleteModule(courseId, moduleId);
  }
}
