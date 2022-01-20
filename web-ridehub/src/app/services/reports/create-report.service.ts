import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reports } from 'src/app/interfaces/reports/reports';
import { url } from '../../secrets';


@Injectable({
  providedIn: 'root'
})
export class CreateReportService {

  constructor(
    private _http: HttpClient
  ) { }

  postReport(data: Reports): Observable<unknown> {
    return this._http.post<unknown>(`${url}/v1/report`, data);
  }
}
