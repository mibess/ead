import { computed, Injectable, signal } from "@angular/core";
import { UserLoggedIn, UserResponse } from "./user.interface";
import { Page } from "../../helpers/pageable.helper";

export interface UserState {
  loading: boolean;
  userLoggedIn: UserLoggedIn | null;
  userSession: UserResponse | null;
}

export interface UserSettingState {
  loading: boolean;
  userSettings: UserResponse | null;
}

export interface UserResponseState {
  loading: boolean;
  users: Page<UserResponse> | null;
}

export interface UserUpdatePasswordState {
  loading: boolean;
  response: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsersSelectors {
  public userState = signal<UserState>({
    loading: false,
    userLoggedIn: null,
    userSession: null
  });

  public userSettingState = signal<UserSettingState>({
    loading: false,
    userSettings: null
  });

  public userResponseState = signal<UserResponseState>({
    loading: false,
    users: null
  });

  public userUpdatePasswordState = signal<UserUpdatePasswordState>({
    loading: false,
    response: null
  });

  public readonly userLoggedIn = computed(() => this.userState().userLoggedIn);
  public readonly userSession = computed(() => this.userState().userSession);
  public readonly userSettings = computed(() => this.userSettingState().userSettings);
  public readonly users = computed(() => this.userResponseState().users);
}
