import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { CustomerInfoByIdForCustomerInfoComponent } from '../shared/share-components/customer-info/customer-info.service';
import { GeneralSrv } from './../shared/services/GeneralSrv.service';

@Injectable({
  providedIn: 'root'
})
export class NewCustomerService {
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/';
  constructor(
    private generalService: GeneralSrv,
    private http: HttpClient,
    // private customerDetailService: CustomerDetailsService,

  ) { }


  saveNewCustomer(newCustomer: CustomerInfoByIdForCustomerInfoComponent) {
    console.log('NEW CUSTOMER FOR SAVING', newCustomer);
    return this.http.post(`${this.baseUrl}Customer/SaveCustomerInfo_ForNew?urlAddr=${this.generalService.getOrgName()}`, newCustomer)
      .pipe(
        catchError(error => throwError(error)));
  }



  getCurrentLanguage$(){
   return this.generalService.currentLang$;
  }
}
