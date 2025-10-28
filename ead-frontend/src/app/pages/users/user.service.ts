import { inject, Injectable } from '@angular/core';
import { UserApi } from './user.api';
import { UsersSelectors } from './user.selectors';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userApi = inject(UserApi);
  private readonly usersSelectors = inject(UsersSelectors);

  public getUser(userId: string) : void {
    this.usersSelectors.userSettingState.update(state => ({ ...state, loading: true }));

    this.userApi.getUserById(userId).subscribe(user => {
      this.usersSelectors.userSettingState.update(state => ({
        ...state, loading: false, userSettings: user
      }));

    });
  }
}
