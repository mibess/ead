import { inject, Injectable } from "@angular/core";
import { UserLoggedIn, UserResponse } from "../pages/users/user.interface";
import { UsersSelectors } from "../pages/users/user.selectors";

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  public readonly userSelectors = inject(UsersSelectors);

  public setUserLoggedIn(userSession: UserResponse): void {
    const userLoggedIn: UserLoggedIn = {
      id: userSession.userId,
      name: userSession.fullName,
      email: userSession.email
    };

    this.userSelectors.userState.update(state => ({
      ...state,
      userLoggedIn: userLoggedIn,
      userSession: userSession
    }));

    localStorage.setItem('userLoggedIn', JSON.stringify(userLoggedIn));
  }

  public getUserLoggedIn(): UserLoggedIn | null {
    const userSession = localStorage.getItem('userLoggedIn');
    return userSession ? JSON.parse(userSession) : null;
  }

  public removeUserLoggedIn(): void {
    localStorage.removeItem('userLoggedIn');
    this.userSelectors.userState.update(state => ({
      ...state,
      userLoggedIn: null,
      userSession: null
    }));
  }
}