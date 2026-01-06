import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { UserService } from '../user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSelectors } from '../user.selectors';
import { UserResponse, UserUpdatePasswordRequest } from '../user.interface';
import { ButtonComponent } from "../../../shared/button.component/button.component";
import { Input } from '../../../shared/input/input';
import { BackgroundEffectsComponent } from "../../../shared/background-effects/background-effects.component";
import { HeaderPageComponent } from "../../../shared/header-page/header-page.component";

@Component({
  selector: 'app-users-settings.page',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, ButtonComponent, Input, BackgroundEffectsComponent, HeaderPageComponent],
  templateUrl: './users-settings.page.html',
  styleUrl: './users-settings.page.css',
})
export class UsersSettingsPage implements OnInit {
  public readonly userService = inject(UserService);
  public readonly usersSelectors = inject(UsersSelectors);

  userSettingsFormGroup = new FormGroup({
    username: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    fullName: new FormControl('', { nonNullable: true }),
    email: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    cpf: new FormControl('', { nonNullable: true }),
    imageUrl: new FormControl('', { nonNullable: true })
  });

  passwordFormGroup = new FormGroup({
    oldPassword: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
    confirmPassword: new FormControl('', { nonNullable: true })
  });

  constructor() {
    effect(() => {
      const userSettings = this.usersSelectors.userSettings();

      if (userSettings) {
        this.userSettingsFormGroup.patchValue(userSettings);
      }
    });
  }

  ngOnInit(): void {
    const userLoggedIn = localStorage.getItem('userLoggedIn');

    if (userLoggedIn) {
      const userData = JSON.parse(userLoggedIn);
      this.userService.getUser(userData.id);
    }
  }

  public saveUserSettings(): void {
    if (!this.userSettingsFormGroup.valid) {
      return;
    }

    const updatedSettings: UserResponse = {
      ...this.userSettingsFormGroup.getRawValue(),
      userId: this.usersSelectors.userSettings()?.userId || ''
    };

    this.userService.updateUserSettings(updatedSettings).subscribe({

      next: (userResponse) => {
        if (userResponse?.userId) {
          alert('User settings updated successfully!');
        } else {
          alert('Failed to update: Invalid response from server.');
        }
      },

      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update user settings. Please try again later.');
      }
    });
  }

  public updatePassword(): void {
    if (!this.passwordFormGroup.valid || !this.validPassword()) {
      alert('Invalid password');
      return;
    }

    const userUpdatePasswordRequest: UserUpdatePasswordRequest = {
      password: this.passwordFormGroup.value.password || '',
      oldPassword: this.passwordFormGroup.value.oldPassword || ''
    };

    this.userService.updatePassword(this.usersSelectors.userSettings()?.userId || '', userUpdatePasswordRequest).subscribe({
      next: (response) => {
        alert(response);
      },

      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update user settings. Please try again later.');
      }
    });
  }

  private validPassword(): boolean {
    return this.passwordFormGroup.value.password === this.passwordFormGroup.value.confirmPassword;
  }
}
