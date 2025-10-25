import { Routes } from "@angular/router";
import { UsersPage } from "./users.page/users.page";

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersPage,
    children: []
  }
];
