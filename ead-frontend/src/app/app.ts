import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserStorageService } from './storage/user-storage.service';
import { UsersSelectors } from './pages/users/user.selectors';
import { UserApi } from './pages/users/user.api';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private readonly userApi = inject(UserApi);
  private readonly userSelectors = inject(UsersSelectors);
  private readonly userStorageService = inject(UserStorageService);

  constructor() {
    if (this.userStorageService.getUserLoggedIn() && !this.userStorageService.getUserSession()) {
      this.reloadUserSession(this.userStorageService.getUserLoggedIn()!.id);
    }
  }

  public reloadUserSession(userId: string): void {
    this.userApi.getUserById(userId).subscribe(userSession => {
      this.userSelectors.userState.update(state => ({
        ...state,
        userSession: userSession
      }));
    });
  }
}
