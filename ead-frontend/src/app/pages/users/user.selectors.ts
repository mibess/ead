import { computed, Injectable, signal } from "@angular/core";
import { UserLoggedIn } from "./user.interface";

export interface UserState {
  loading: boolean;
  userLoggedIn: UserLoggedIn | null;
}

@Injectable({
  providedIn: 'root'
})
export class UsersSelectors {
  public userState = signal<UserState>({
    loading: false,
    userLoggedIn: null
  });

  public readonly loading = computed(() => this.userState().loading);
  public readonly userLoggedIn = computed(() => this.userState().userLoggedIn);
}
