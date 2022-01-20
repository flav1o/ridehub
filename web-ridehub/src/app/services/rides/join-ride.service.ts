import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JoinRide } from 'src/app/interfaces/rides/join-ride';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class JoinRideService {

  constructor(private _http: HttpClient) { }

  joinRideUser(data: JoinRide){
    return this._http.post(`${url}/v1/occupant`, data)
  }
}
