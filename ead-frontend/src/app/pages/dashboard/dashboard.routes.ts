import { Routes } from "@angular/router";
import { DashboardPage } from "./dashboard.page/dashboard.page";

// Exportamos a constante para que o app.routes.ts possa importá-la
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: []
  }
];

