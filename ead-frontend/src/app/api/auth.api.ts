import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserSignupRequest, UserSignupResponse } from '../interface/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private readonly apiBaseUrl : string = environment.API_BASE_URL + '/auth';
  private readonly http = inject(HttpClient);

  public signup(userSignupRequest: UserSignupRequest): Observable<UserSignupResponse> {
    return this.http.post<UserSignupResponse>(`${this.apiBaseUrl}/signup`, userSignupRequest);
  }
}
