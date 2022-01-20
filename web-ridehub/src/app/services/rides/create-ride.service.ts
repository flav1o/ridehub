import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rides } from 'src/app/interfaces/rides/ride';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class createRidesService {

  constructor(private _http: HttpClient) { }

  createRide(data: Rides) {
    return this._http.post(`${url}/v1/ride`, data);
  }
}
