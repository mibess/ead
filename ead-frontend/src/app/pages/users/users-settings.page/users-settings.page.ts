import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { UserService } from '../user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSelectors } from '../user.selectors';
import { UserResponse } from '../user.interface';
import { ButtonComponent } from "../../../shared/button.component/button.component";
import { Input } from '../../../shared/input/input';
import { BackgroundEffectsComponent } from "../../../shared/background-effects/background-effects.component";

@Component({
  selector: 'app-users-settings.page',
  imports: [RouterModule, FormsModule, ReactiveFormsModule, ButtonComponent, Input, BackgroundEffectsComponent],
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

}
