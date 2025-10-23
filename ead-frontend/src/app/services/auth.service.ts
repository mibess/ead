import { inject, Injectable } from '@angular/core';
import { AuthApi } from '../api/auth.api';
import { SignalSelectors } from '../selectors/signal.selectors';
import { UserSignupRequest } from '../interface/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  public readonly signalSelectors = inject(SignalSelectors);

  public signup(userSignupRequest: UserSignupRequest) : void {
    this.signalSelectors.signupState.update(state => ({ ...state, loading: true }));

    this.authApi.signup(userSignupRequest).subscribe({
      next: (response) => {
        this.signalSelectors.signupState.update(state => ({ ...state, loading: false }));
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.signalSelectors.signupState.update(() => ({ loading: false, error: error.message }) );
      }
    });
  }
}
