import { Routes } from "@angular/router";
import { UsersPage } from "./users.page/users.page";
import { UsersSettingsPage } from "./users-settings.page/users-settings.page";

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UsersPage,
    children: [
      {
        path: 'settings',
        component: UsersSettingsPage
      },
    ]
  }
];
