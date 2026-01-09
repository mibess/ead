import { inject, Injectable } from '@angular/core';
import { UserApi } from './user.api';
import { UsersSelectors } from './user.selectors';
import { UserFilter, UserResponse, UserUpdateAvatarRequest, UserUpdatePasswordRequest } from './user.interface';
import { delay, finalize, Observable, tap } from 'rxjs';
import { Page, Pageable } from '../../helpers/pageable.helper';
import { UserStorageService } from '../../storage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userApi = inject(UserApi);
  private readonly usersSelectors = inject(UsersSelectors);
  private readonly userStorageService = inject(UserStorageService);

  public getAll(pageable: Pageable, filter?: UserFilter): Observable<Page<UserResponse>> {
    return this.userApi.getAll(pageable, filter);
  }

  public getUser(userId: string): void {
    this.usersSelectors.userSettingState.update(state => ({ ...state, loading: true }));

    this.userApi.getUserById(userId).subscribe(user => {
      this.usersSelectors.userSettingState.update(state => ({
        ...state, loading: false, userSettings: user
      }));

    });
  }

  public updateUserSettings(updatedSettings: UserResponse): Observable<UserResponse> {
    this.usersSelectors.userSettingState.update(state => ({ ...state, loading: true }));

    return this.userApi.updateUser(updatedSettings).pipe(
      delay(5000),
      tap(user => {
        this.usersSelectors.userSettingState.update(state => ({
          ...state,
          loading: false,
          userSettings: user
        }));

        this.userStorageService.setUserLoggedIn(user);
      })
    );
  }

  public deleteUser(userId: string): Observable<string> {
    this.usersSelectors.userResponseState.update(state => ({ ...state, loading: true }));

    return this.userApi.deleteUser(userId).pipe(
      finalize(() => {
        this.usersSelectors.userResponseState.update(state => ({ ...state, loading: false }));
      })
    );
  }

  public updatePassword(userId: string, userUpdatePasswordRequest: UserUpdatePasswordRequest): Observable<string> {
    this.usersSelectors.userUpdatePasswordState.update(state => ({ ...state, loading: true }));

    return this.userApi.updatePassword(userId, userUpdatePasswordRequest).pipe(
      delay(5000),
      tap(() => {
        this.usersSelectors.userUpdatePasswordState.update(state => ({ ...state, loading: false }));
      })
    );
  }

  public updateAvatar(userId: string, userUpdateAvatarRequest: UserUpdateAvatarRequest): Observable<UserResponse> {
    return this.userApi.updateAvatar(userId, userUpdateAvatarRequest);
  }
}
