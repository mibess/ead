import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackgroundEffectsComponent } from "../../../shared/background-effects/background-effects.component";

@Component({
  selector: 'app-dashboard.page',
  standalone: true,
  imports: [RouterModule, BackgroundEffectsComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  private readonly route = inject(Router);

  public userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn') || '{}');
  public isSidebarOpen = false;

  public toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  public closeSidebar() {
    this.isSidebarOpen = false;
  }

  public logout() {
    localStorage.removeItem('userLoggedIn');
    this.route.navigate(['/']);
  }
}
