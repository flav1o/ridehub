import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rides } from 'src/app/interfaces/rides/ride';
import { User } from 'src/app/interfaces/users/user';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class GetUsersService {

  constructor(private _http: HttpClient) { }

  getUsers(userID: number): Observable<User> {
    return this._http.get<User>(`${url}/v1/users/${userID}`);
  }

  getOccupants(rideID: number): Observable<User[]> {
    return this._http.get<User[]>(`${url}/v1/occupants/${rideID}`)
  }

  getUserMoney(userID: number): Observable<unknown> {
    return this._http.get(`${url}/v1/users/money/${userID}`)
  }

  updateUserMoney(userID: number, data: object): Observable<unknown> {
    return this._http.put(`${url}/v1/users/balance/${userID}`, data)
  }

  updateUser(userID: number, data: User): Observable<unknown> {
    return this._http.put(`${url}/v1/users/${userID}`, data)
  }

  deactivateUser(userID: number) {
    return this._http.patch(`${url}/v1/users/${userID}`, {})
  }

  getNewComers(): Observable<User[]> {
    return this._http.get<User[]>(`${url}/v1/users/activeUsers/newcomers`);
  }

  searchByName(nome: string): Observable<User[]> {
    return this._http.get<User[]>(`${url}/v1/users/activeUsers/searchByName`, {
      params: {
        nome
      }
    });
  }

  getDriverRides(userID: number): Observable<any>{
    return this._http.get<any>(`${url}/v1/users/driver/${userID}`);
  }

  getActiveRides(userID: number): Observable<any> {
    return this._http.get<any>(`${url}/v1/users/active/${userID}`);
  }
}
