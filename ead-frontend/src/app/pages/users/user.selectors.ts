import { computed, Injectable, signal } from "@angular/core";
import { UserLoggedIn, UserResponse } from "./user.interface";

export interface UserState {
  loading: boolean;
  userLoggedIn: UserLoggedIn | null;
}

export interface UserSettingState {
  loading: boolean;
  userSettings: UserResponse | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsersSelectors {
  public userState = signal<UserState>({
    loading: false,
    userLoggedIn: null
  });

  public userSettingState = signal<UserSettingState>({
    loading: false,
    userSettings: null
  });

  public readonly userLoggedIn = computed(() => this.userState().userLoggedIn);
  public readonly userSettings = computed(() => this.userSettingState().userSettings);
}
