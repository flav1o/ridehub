import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from 'src/app/interfaces/transactions/transaction';
import { url } from '../../secrets';

@Injectable({
  providedIn: 'root'
})
export class GetTransactionsService {

  constructor(
    private _http: HttpClient,
  ) { }

  getUserTransactions(userID: number): Observable<Transaction[]> {
    return this._http.get<Transaction[]>(`${url}/v1/transaction/author/${userID}`)
  }
}
