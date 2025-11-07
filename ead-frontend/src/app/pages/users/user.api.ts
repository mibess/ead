import { UserResponse } from './user.interface';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserApi {
  private readonly apiBaseUrl : string = environment.API_BASE_URL + '/users';
  private readonly http = inject(HttpClient);

  public getUserById(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiBaseUrl}/${userId}`);
  }

  public updateUser(updatedSettings: UserResponse): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiBaseUrl}/${updatedSettings.userId}`, updatedSettings);
  }
}
