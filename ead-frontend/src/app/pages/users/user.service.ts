import { inject, Injectable } from '@angular/core';
import { UserApi } from './user.api';
import { UsersSelectors } from './user.selectors';
import { UserResponse } from './user.interface';
import { delay, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userApi = inject(UserApi);
  private readonly usersSelectors = inject(UsersSelectors);


  public getAll(): Observable<UserResponse[]> {
    return this.userApi.getAll();
  }

  public getUser(userId: string): void {
    this.usersSelectors.userSettingState.update(state => ({ ...state, loading: true }));

    this.userApi.getUserById(userId).subscribe(user => {
      this.usersSelectors.userSettingState.update(state => ({
        ...state, loading: false, userSettings: user
      }));

    });
  }

  public updateUserSettings(updatedSettings: UserResponse): Observable<UserResponse> { // <-- Return Observable
    this.usersSelectors.userSettingState.update(state => ({ ...state, loading: true }));

    // We return the API call directly
    return this.userApi.updateUser(updatedSettings).pipe(
      delay(5000), // <-- This is the RxJS version of your setTimeout

      // 'tap' lets us perform side effects (like state updates)
      // when the data comes back from the API.
      tap(user => {
        this.usersSelectors.userSettingState.update(state => ({
          ...state,
          loading: false,
          userSettings: user
        }));

        // Good practice to update localStorage *after* API success
        localStorage.setItem('userSettings', JSON.stringify(user));
      })
    );
  }
}
