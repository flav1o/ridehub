import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as secrets from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class GeoCodingService {

  constructor(private _http: HttpClient) { }

  parseToCoords(location: string) {
    return this._http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${secrets.mapboxToken}`);
  }
  
}
