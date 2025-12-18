import { AuthService } from './../../../services/auth.service';
import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Added CommonModule for *ngIf (or use @if)
import { UserSignupRequest } from '../../../pages/users/user.interface';
import { Input } from '../../../shared/input/input';
import { LoginWithComponent } from "../../../shared/login-with.component/login-with.component";
import { AlertComponent } from "../../../shared/alert.component/alert.component";
import { ButtonComponent } from "../../../shared/button.component/button.component";

@Component({
  selector: 'app-signup.page',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Input,
    LoginWithComponent,
    CommonModule,
    AlertComponent,
    ButtonComponent,
  ],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.css',
})
export class SignupPage {
  public readonly authService = inject(AuthService);

  public currentStep = signal(1);
  public readonly totalSteps = 5;

  username = new FormControl('', [Validators.required]);
  fullName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [Validators.required]);
  cpf = new FormControl(''); // Optional/Skippable at this stage
  password = new FormControl('', [Validators.required]);
  confirmPassword = new FormControl('', [Validators.required]);
  imageUrl = new FormControl('');

  public nextStep(): void {
    if (this.currentStep() === 1 && this.username.invalid) {
      this.username.markAsTouched();
      return;
    }

    if (this.currentStep() === 2 && (this.fullName.invalid || this.email.invalid)) {
      this.fullName.markAsTouched();
      this.email.markAsTouched();
      return;
    }

    if (this.currentStep() === 3 && this.phoneNumber.invalid) {
      this.phoneNumber.markAsTouched();
      return;
    }

    // Step 4 is CPF (Document), which can be skipped, so no forced validation here unless we want to validate format IF typed.
    // For now, nextStep assumes if they typed something invalid, the Input component or validators might show error, 
    // but the requirement says "can skip". We'll allow next.

    if (this.currentStep() === 5) {
      this.signup();
      return;
    }

    this.currentStep.update(v => v + 1);
  }

  public prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(v => v - 1);
    }
  }

  public skipStep(): void {
    if (this.currentStep() === 4) {
      this.cpf.setValue(''); // Clear if skipping
      this.currentStep.update(v => v + 1);
    }
  }

  public signup(): void {
    if (!this.validatePassword()) {
      this.authService.signalSelectors.signupState().error = 'Passwords do not match!';
      return;
    }

    if (this.password.invalid || this.confirmPassword.invalid) {
      this.password.markAsTouched();
      this.confirmPassword.markAsTouched();
      return;
    }

    const userSignupRequest: UserSignupRequest = {
      username: this.username.value || '',
      email: this.email.value || '',
      password: this.password.value || '',
      fullName: this.fullName.value || '',
      phoneNumber: this.phoneNumber.value || '',
      cpf: this.cpf.value || '',
      imageUrl: this.imageUrl.value || ''
    };

    this.authService.signup(userSignupRequest);
  }

  private validatePassword(): boolean {
    return this.password.value === this.confirmPassword.value;
  }

}
