import { Component, inject, effect, computed, signal } from '@angular/core';
import { UserService } from '../user.service';
import { UsersSelectors } from '../user.selectors';
import { HeaderPageComponent } from '../../../shared/header-page/header-page.component';
import { BackgroundEffectsComponent } from '../../../shared/background-effects/background-effects.component';

@Component({
  selector: 'app-user-list.page',
  standalone: true,
  imports: [HeaderPageComponent, BackgroundEffectsComponent],
  templateUrl: './user-list.page.html',
  styleUrl: './user-list.page.css',
})
export class UserListPage {
  public readonly userService = inject(UserService);
  public readonly usersSelectors = inject(UsersSelectors);

  public readonly users = this.usersSelectors.users;
  public readonly loading = computed(() => this.usersSelectors.userResponseState().loading);
  public readonly viewMode = signal<'card' | 'list'>('list');

  constructor() {
    effect(() => {
      this.usersSelectors.userResponseState.set({
        loading: true,
        users: null
      });

      this.userService.getAll().subscribe((users) => {
        this.usersSelectors.userResponseState.set({
          loading: false,
          users: users
        });
      });
    });
  }
}
