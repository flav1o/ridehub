import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from 'src/app/interfaces/auth/register';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private _http: HttpClient) { }

  authRegister(data: Register) {
    console.log(data);
    return this._http.post(`${url}/auth/signup`, data)
  }

}
