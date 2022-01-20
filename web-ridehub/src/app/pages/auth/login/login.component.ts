import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/auth/login';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { LoginService } from 'src/app/services/auth/login.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  alertStatus: AlertModal;

  constructor(
    private _login: LoginService,
    public componentToggler: ComponentTogglerService,
    private _tokenDecoder: TokenService,
    private _userData: UserDataService,
    private _router: Router
  ) { }

  ngOnInit(): void { }

  sendForm(loginForm): void {
    if (loginForm.form.status === 'INVALID') return;

    const userLoginData: Login = loginForm.form.value;
    console.log(userLoginData)

    this.componentToggler.loading = true;
    this._login.authLogin(userLoginData).subscribe(
      data => this.loginOnSuccess(data),
      error => this.loginOnError(error)
    )
  }

  loginOnSuccess(data): void {
    localStorage.setItem('userToken', data.token);
    this._userData.userToken = data.token;
    this._tokenDecoder.decodeToken(data.token)

    this.componentToggler.loading = false;
    this.alertStatus = { success: true, message: 'Welcome! Redirecting...' }
    this.componentToggler.alertModal = true;

    setTimeout(() => {
      this._router.navigate(['/home']);
    }, 4000);
  }

  loginOnError(error): void {
    this.componentToggler.loading = false;

    if (error.status === 400)
      this.alertStatus = { success: false, message: 'Please verify your data!' };

    if (error.status === 0)
      this.alertStatus = { success: false, message: 'Our services are offline, try again later!' };

    if (error.status === 500)
      this.alertStatus = { success: false, message: 'We are under maintenance, try again later! ' };

    this.componentToggler.alertModal = true;
  }
}
