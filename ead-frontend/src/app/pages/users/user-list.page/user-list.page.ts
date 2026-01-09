import { Component, inject, effect, computed, signal } from '@angular/core';
import { UserService } from '../user.service';
import { UsersSelectors } from '../user.selectors';
import { HeaderPageComponent } from '../../../shared/header-page/header-page.component';
import { BackgroundEffectsComponent } from '../../../shared/background-effects/background-effects.component';
import { UserFilter, UserStatus, UserType } from '../user.interface';

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

  public readonly openMenuId = signal<string | null>(null);

  public readonly selectedUser = computed(() => {
    const userId = this.openMenuId();
    if (!userId) return null;
    return this.usersPage()?.content.find(u => u.userId === userId) || null;
  });

  // Filter signals
  public readonly searchTerm = signal<string>('');
  public readonly filterUserType = signal<UserType | ''>('');
  public readonly filterUserStatus = signal<UserStatus | ''>('');

  // Expose enums to template
  public readonly UserType = UserType;
  public readonly UserStatus = UserStatus;
  public readonly userTypes = Object.values(UserType);
  public readonly userStatuses = Object.values(UserStatus);

  constructor() {
    effect(() => {
      this.loadUsers();
    });
  }

  private loadUsers(): void {
    this.usersSelectors.userResponseState.update(state => ({
      ...state,
      loading: true
    }));

    const pageable = {
      page: this.currentPage(),
      size: this.pageSize(),
      sort: ['userId,asc']
    };

    const filter: UserFilter = {};
    const term = this.searchTerm();
    const type = this.filterUserType();
    const status = this.filterUserStatus();

    if (term) {
      filter.email = term;
    }
    if (type) {
      filter.userType = type;
    }
    if (status) {
      filter.userStatus = status;
    }

    this.userService.getAll(pageable, filter).subscribe({
      next: (page) => {
        this.usersSelectors.userResponseState.set({
          loading: false,
          users: page
        });
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.usersSelectors.userResponseState.update(state => ({
          ...state,
          loading: false
        }));
      }
    });
  }

  public onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(0); // Reset to first page on search
  }

  public onTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filterUserType.set(target.value as UserType | '');
    this.currentPage.set(0);
  }

  public onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filterUserStatus.set(target.value as UserStatus | '');
    this.currentPage.set(0);
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

  public toggleMenu(userId: string, event: Event): void {
    event.stopPropagation();
    if (this.openMenuId() === userId) {
      this.openMenuId.set(null);
    } else {
      this.openMenuId.set(userId);
    }
    console.log('Toggled menu for user', userId);
  }

  public closeMenu(): void {
    this.openMenuId.set(null);
  }

  public deleteUser(userId: string): void {
    console.log('Deleting user', userId);
    //if (confirm('Are you sure you want to delete this user?')) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        this.closeMenu();
      },
      error: (err) => console.error('Error deleting user', err)
    });
    //}
  }

  public alertTest(userId: string) {
    alert('Test ' + userId);
  }
}
