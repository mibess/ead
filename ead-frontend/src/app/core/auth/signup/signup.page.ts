import { AuthService } from './../../../services/auth.service';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSignupRequest } from '../../../pages/users/user.interface';

@Component({
  selector: 'app-signup.page',
  imports: [ RouterModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.css',
})
export class SignupPage {
  public readonly authService = inject(AuthService);

  username = new FormControl('');
  fullName = new FormControl('');
  email    = new FormControl('');
  phoneNumber = new FormControl('');
  cpf         = new FormControl('');
  password    = new FormControl('');
  confirmPassword = new FormControl('');
  imageUrl = new FormControl('');

  public signup(): void {
    if (!this.validatePassword()) {
      alert('Passwords do not match!');
      return;
    }

    const userSignupRequest : UserSignupRequest = {
      username: this.username.value || '',
      email:    this.email.value || '',
      password: this.password.value || '',
      fullName: this.fullName.value || '',
      phoneNumber: this.phoneNumber.value || '',
      cpf:      this.cpf.value || '',
      imageUrl: this.imageUrl.value || ''
    };

    this.authService.signup(userSignupRequest);
  }

  private validatePassword(): boolean {
    return this.password.value !== null &&
           this.password.value !== '' &&
           this.confirmPassword.value !== null &&
           this.confirmPassword.value !== '' &&
           this.password.value === this.confirmPassword.value;
  }

}
