import { Routes } from "@angular/router";
import { UsersPage } from "./users.page/users.page";
import { UsersSettingsPage } from "./users-settings.page/users-settings.page";
import { UserListPage } from "./user-list.page/user-list.page";

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserListPage,
    children: [
      {
        path: 'settings',
        component: UsersSettingsPage
      },
      {
        path: 'list',
        component: UserListPage
      },
    ]
  }
];
