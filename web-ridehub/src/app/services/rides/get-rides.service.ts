import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rides } from 'src/app/interfaces/rides/ride';
import { CurrentRidesCard } from 'src/app/interfaces/current-rides/current-rides-card';
import { NumberOccupants } from 'src/app/interfaces/rides/number-occupants';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class RidesService {

  constructor(private _http: HttpClient) { }

  getRides(): Observable<Rides> {
    return this._http.get<Rides>(`${url}/v1/ride`);
  }

  getOneRide(rideID: number): Observable<any> {
    return this._http.get<any>(`${url}/v1/ride/${rideID}`);
  }

  getCurrentRides(currentPage: number): Observable<CurrentRidesCard[]> {
    return this._http.get<CurrentRidesCard[]>(`${url}/v1/listed/${currentPage}`);
  }

  orderBy(currentPage: number, orderType: string):  Observable<CurrentRidesCard[]> {
    return this._http.get<CurrentRidesCard[]>(`${url}/v1/listed/search/${currentPage}`, { params: { currentPage, orderType } });
  }

  searchByWord(word: string):  Observable<CurrentRidesCard[]> {
    const type = 'all';
    return this._http.get<CurrentRidesCard[]>(`${url}/v1/listed/search/word/${type}`, { params: { word } });
  }

  getRideNumberOccupants(rideID: number): Observable<NumberOccupants> {
    return this._http.get<NumberOccupants>(`${url}/v1/ride/ammount/${rideID}`);
  }

  toggleRideState(rideID: number, estado: string) {
    return this._http.put(`${url}/v1/ride/state/${rideID}`, { estado })
  }
}

