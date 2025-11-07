import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { UserService } from '../user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSelectors } from '../user.selectors';

@Component({
  selector: 'app-users-settings.page',
  imports: [ RouterModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './users-settings.page.html',
  styleUrl: './users-settings.page.css',
})
export class UsersSettingsPage implements OnInit {
  public readonly userService = inject(UserService);
  public readonly usersSelectors = inject(UsersSelectors);

  userSettingsFormGroup = new FormGroup({
    username: new FormControl({ value: '', disabled: true }, { nonNullable: true }), // <-- After
    fullName: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
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

}
