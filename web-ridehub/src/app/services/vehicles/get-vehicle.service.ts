import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from 'src/app/interfaces/vehicles/vehicle';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  constructor(private _http: HttpClient) { }

  getVehicle(userID: number): Observable<Vehicle[]>{
    return this._http.get<Vehicle[]>(`${url}/v1/vehicle/owner/${userID}`);
  }

  createVehicle(data: Vehicle): Observable<Vehicle> {
    return this._http.post<Vehicle>(`${url}/v1/vehicle/`, data);
  }

  deleteVehicle(vehicleID: number) {
    return this._http.delete(`${url}/v1/vehicle/${vehicleID}`);
  }
}
