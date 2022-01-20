import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface MapboxOutput {
  attribution: string;
  features: Feature[];
  query: [];
}

export interface Feature {
  place_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationsServiceService {

  constructor(private http: HttpClient) { }

  search_word(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(url + query + '.json?types=address&access_token='
    + "pk.eyJ1IjoidG91a2x3ZXoiLCJhIjoiY2t2M3VvZ2Q1MGEwdTJ3cGcwMHQ3Zjh5eiJ9.LsgKO5Lxz9x55lv-5C7cmQ")
    .pipe(map((res: any) => {
      return res.features;
    }));
  }
}