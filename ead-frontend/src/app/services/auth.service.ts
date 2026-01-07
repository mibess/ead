import { UserLoggedIn } from './../pages/users/user.interface';
import { inject, Injectable } from '@angular/core';
import { AuthApi } from '../api/auth.api';
import { SignalSelectors } from '../selectors/signal.selectors';
import { Router } from '@angular/router';
import { UserResponse, UserSignupRequest } from '../pages/users/user.interface';
import { UsersSelectors } from '../pages/users/user.selectors';
import { catchError, delay, Observable, tap, throwError } from 'rxjs';
import { UserApi } from '../pages/users/user.api';
import { UserStorageService } from '../storage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authApi = inject(AuthApi);
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);

  public readonly signalSelectors = inject(SignalSelectors);
  public readonly userSelectors = inject(UsersSelectors);

  public readonly userStorageService = inject(UserStorageService);

  public signup(userSignupRequest: UserSignupRequest): void {
    this.signalSelectors.signupState.update(state => ({ ...state, loading: true }));
    this.userSelectors.userState.update(state => ({ ...state, loading: true }));

    this.authApi.signup(userSignupRequest).subscribe({
      next: (response) => {
        const userSession = response as UserResponse;

        this.userStorageService.setUserLoggedIn(userSession);

        this.userSelectors.userState.update(state => ({ ...state, loading: false }));
        this.signalSelectors.signupState.update(state => ({ ...state, loading: false, error: null }));

        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.signalSelectors.signupState.update(state => ({ ...state, loading: false, error: e.error.error }));
      }
    });
  }

  private loadUser(userId: string): void {
    this.userSelectors.userState.update(state => ({ ...state, loading: true }));

    this.userApi.getUserById(userId).subscribe(user => {
      this.userSelectors.userState.update(state => ({ ...state, loading: false, userSession: user }));
    });
  }
}
