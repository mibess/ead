import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard.page',
  imports: [ RouterModule ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  private readonly route = inject(Router);

  public userLoggedIn = JSON.parse(localStorage.getItem('userLoggedIn') || '{}');

  public logout() {
    localStorage.removeItem('userLoggedIn');
    this.route.navigate(['/']);
  }
}
