import { UserResponse } from './user.interface';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Page, Pageable } from '../../helpers/pageable.helper';


@Injectable({
  providedIn: 'root'
})
export class UserApi {
  private readonly apiBaseUrl: string = environment.API_BASE_URL + '/users';
  private readonly http = inject(HttpClient);

  public getAll(pageable: Pageable): Observable<Page<UserResponse>> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      pageable.sort.forEach((sortItem: string) => {
        params = params.append('sort', sortItem);
      });
    }

    return this.http.get<Page<UserResponse>>(`${this.apiBaseUrl}`, { params });
  }

  public getUserById(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiBaseUrl}/${userId}`);
  }

  public updateUser(updatedSettings: UserResponse): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiBaseUrl}/${updatedSettings.userId}`, updatedSettings);
  }
}
