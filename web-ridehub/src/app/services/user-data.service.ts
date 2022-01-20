import { Injectable } from '@angular/core';
import { Payload } from '../interfaces/auth/payload';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  user: Payload;
  userToken: string;
}
