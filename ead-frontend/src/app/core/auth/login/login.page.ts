import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginWithComponent } from "../../../shared/login-with.component/login-with.component";

@Component({
  selector: 'app-login.page',
  imports: [RouterModule, LoginWithComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {

}
