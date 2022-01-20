import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evaluations } from 'src/app/interfaces/evaluations/evaluations';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class CreateEvaluationsService {

  constructor(
    private _http: HttpClient
  ) { }

  postEvaluation(data: Evaluations): Observable<unknown> {
    return this._http.post<unknown>(`${url}/v1/evaluation`, data);
  }

  verifyRideEvaluation(rideID: number, userID: number): Observable<any> {
    return this._http.get<any>(`${url}/v1/evaluation/author/${rideID}/${userID}`);
  }

  getEvaluation(userID: number): Observable<Evaluations[]> {
    return this._http.get<Evaluations[]>(`${url}/v1/evaluation/${userID}`);
  }
}
