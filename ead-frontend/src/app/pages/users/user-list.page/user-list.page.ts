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

  // Pagination signals
  public readonly currentPage = signal<number>(0);
  public readonly pageSize = signal<number>(5);

  public readonly usersPage = this.usersSelectors.users;
  public readonly loading = computed(() => this.usersSelectors.userResponseState().loading);
  public readonly viewMode = signal<'card' | 'list'>('list');

  constructor() {
    effect(() => {
      this.loadUsers();
    });
  }

  private loadUsers(): void {
    // for now I will not use the selector to set the loading state
    // this.usersSelectors.userResponseState.set({
    //   loading: true,
    //   users: null
    // });

    this.userService.getAll({
      page: this.currentPage(),
      size: this.pageSize(),
      sort: ['userId,asc'] // Default sort
    }).subscribe((page) => {
      this.usersSelectors.userResponseState.set({
        loading: false,
        users: page
      });
    });
  }

  public nextPage(): void {
    const page = this.usersPage();
    if (page && !page.last) {
      this.currentPage.update(p => p + 1);
    }
  }

  public prevPage(): void {
    const page = this.usersPage();
    if (page && !page.first) {
      this.currentPage.update(p => p - 1);
    }
  }

  public goToPage(pageIndex: number): void {
    this.currentPage.set(pageIndex);
  }
}
