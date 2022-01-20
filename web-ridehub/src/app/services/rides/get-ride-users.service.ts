import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RideUsers } from 'src/app/interfaces/rides/ride-users';
import { Observable } from 'rxjs';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class GetRideUsersService {

  constructor(private _http: HttpClient) { }

  getRideUsers(rideID: number): Observable<RideUsers[]> {
    return this._http.get<RideUsers[]>(`${url}/v1/ride/occupants/${rideID}`);
  }
}
