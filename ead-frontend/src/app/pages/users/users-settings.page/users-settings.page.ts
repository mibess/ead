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
    username: new FormControl(''),
    fullName: new FormControl(''),
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
    cpf: new FormControl(''),
    imageUrl: new FormControl('')
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
