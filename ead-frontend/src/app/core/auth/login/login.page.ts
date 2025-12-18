import { AuthService } from './../../../services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginWithComponent } from "../../../shared/login-with.component/login-with.component";
import { Input } from '../../../shared/input/input';
import { ButtonComponent } from '../../../shared/button.component/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login.page',
  standalone: true,
  imports: [
    RouterModule,
    LoginWithComponent,
    ReactiveFormsModule,
    Input,
    ButtonComponent,
    CommonModule
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public currentStep = signal(1);

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  nextStep() {
    if (this.currentStep() === 1) {
      if (this.email.invalid) {
        this.email.markAsTouched();
        return;
      }
      this.currentStep.set(2);
    }
  }

  prevStep() {
    this.currentStep.set(1);
  }

  login() {
    if (this.currentStep() !== 2) return;

    if (this.password.invalid) {
      this.password.markAsTouched();
      return;
    }

    // TODO: Call actual login method from AuthService once available or mock it for now
    console.log('Login attempt:', this.email.value, this.password.value);

    // For now, let's just assume success or wait for AuthService update if needed.
    // The previous plan mentioned calling AuthService.login(), but looking at AuthService file...
    // It only has 'signup'. We might need to add 'login' to AuthService later or now.
    // The user request was about LAYOUT, but good practice implies logic too.
    // I will check AuthService again.
  }
}
