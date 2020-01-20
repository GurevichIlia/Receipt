import { Response } from 'src/app/models/response.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyAppConfig } from './../../MyappConfig';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable(
)
export class UploadService {
  baseUrl = MyAppConfig.serviceConfig.serviceApiUrl

  constructor(
    private http: HttpClient
  ) { }

  uploadFfile(file) {
    const newFile = file.item(0)
    let formData = new FormData();

    formData.append('upload', newFile, newFile.name);

    let headers = new HttpHeaders()
    let params = new HttpParams();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('enctype', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      header: headers,
      params: params,
      reportProgress: true,
    };

    return this.http.post(`${this.baseUrl}NewsLetter/UploadFile/`, formData, options).pipe(map((res: Response) => res.Data), catchError(err => {
      console.log('ERROR', err)
      return of({})
    }))
  }
}
