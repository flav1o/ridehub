import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rides } from 'src/app/interfaces/rides/ride';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class DeleteRideService {

  constructor(private _http: HttpClient) { }

  cancelRide(rideID: number, ride: Rides | unknown) {

    return this._http.put(`${url}/v1/ride/${rideID}`, ride);
  }

  leaveRide(rideID: number, userID: number) {
    return this._http.delete(`${url}/v1/occupant/${rideID}/${userID}`);
  }
}
