import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ForgetPassword } from 'src/app/interfaces/auth/forget-password';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  constructor(  
    private _http: HttpClient
  ) { }

  forgetPassword(data:ForgetPassword){
    return this._http.put(`${url}/auth/forget-password`, data);
  }
}
