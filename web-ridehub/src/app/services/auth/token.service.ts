import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Payload } from 'src/app/interfaces/auth/payload';
import { UserDataService } from '../user-data.service';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private userData: UserDataService,
    private _router: Router,
    ) { }

  decodeToken(rawToken:string): void {
    const helper = new JwtHelperService();
    const payload: Payload = helper.decodeToken(rawToken);

    this.userData.user = payload;
  }

  verifyLogin(): void{
    const Token = localStorage.getItem('userToken');

    if(!Token) {
      this._router.navigate(['/login'])
      return;
    } 

    this.decodeToken(Token);
  }
}
