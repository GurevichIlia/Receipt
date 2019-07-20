import { AuthenticationService } from './../services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/';
  httpOptions;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.tokenNo
      })
    };

  }

  getGridData() {
    return this.http.get(`${this.baseUrl}keva/GetKevaListData?JsonParam=ss&urlAddr=jaffanet1`, this.httpOptions).pipe(map(data => data = data['Data']))
  }
}