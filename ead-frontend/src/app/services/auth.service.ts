import { UserLoggedIn } from './../pages/users/user.interface';
import { inject, Injectable } from '@angular/core';
import { AuthApi } from '../api/auth.api';
import { SignalSelectors } from '../selectors/signal.selectors';
import { Router } from '@angular/router';
import { UserResponse, UserSignupRequest } from '../pages/users/user.interface';
import { UsersSelectors } from '../pages/users/user.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  public readonly signalSelectors = inject(SignalSelectors);
  public readonly userSelectors = inject(UsersSelectors);

  public signup(userSignupRequest: UserSignupRequest): void {
    this.signalSelectors.signupState.update(state => ({ ...state, loading: true }));
    this.userSelectors.userState.update(state => ({ ...state, loading: true }));

    this.authApi.signup(userSignupRequest).subscribe({
      next: (response) => {
        this.signalSelectors.signupState.update(state => ({ ...state, loading: false, error: null }));

        const userResponse = response as UserResponse;

        const userLoggedIn: UserLoggedIn = {
          id: userResponse.userId,
          name: userResponse.fullName,
          email: userResponse.email
        };

        this.userSelectors.userState.update(state => ({ ...state, userLoggedIn: userLoggedIn, loading: false }));

        localStorage.setItem('userLoggedIn', JSON.stringify(userLoggedIn));

        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        this.signalSelectors.signupState.update(state => ({ ...state, loading: false, error: e.error }));
      }
    });
  }
}
