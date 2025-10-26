import { computed, Injectable, signal } from '@angular/core';

export interface SignupState {
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SignalSelectors {
  public signupState = signal<SignupState>({
    loading: false,
    error: null
  });

  public readonly loading = computed(() => this.signupState().loading);
  public readonly error = computed(() => this.signupState().error);
}
