import { GlobalStateService } from './../shared/global-state-store/global-state.service';
import { GlobalEventsService } from './../core/services/global-events.service';
import { CustomerInfoService } from 'src/app/receipts/customer-info/customer-info.service';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerDetailsService } from './../customer-details/customer-details.service';
import { Response } from 'src/app/models/response.model';
import { takeUntil } from 'rxjs/operators';
import { NewCustomerService } from './new-customer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerInfoByIdForCustomerInfoComponent } from '../receipts/customer-info/customer-info.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit, OnDestroy {
  subscription$ = new Subject();
  currentLang: string
  constructor(
    private router: Router,
    private newCustomerService: NewCustomerService,
    private toaster: ToastrService,
    private customerDetails: CustomerDetailsService,
    private customerInfoService: CustomerInfoService,
    private globalStateService: GlobalStateService,

  ) { }

  ngOnInit() {
    this.getCurrentLanguage();
  }

  goToCustomerDetails() {
    this.router.navigate([`customer-details/customer/main-info`]);
  }

  saveNewCustomer(newCustomer: CustomerInfoByIdForCustomerInfoComponent) {
    this.newCustomerService.saveNewCustomer(newCustomer)
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((response: Response) => {
        if (response) {
          if (response.Data.error === 'false') {
            console.log('AFTER SAVING', response)
            this.customerDetails.setCustomerId(+response.Data.customerid);
            const message = this.currentLang === 'he' ? 'עודכן בהצלחה' : 'Successfully';
            this.toaster.success('', message, {
              positionClass: 'toast-top-center'
            });
            this.goToCustomerDetails();
            this.globalStateService.clearCustomerList();

          } else {
            console.log('NEW CUSTOMER ERROR', response)
            this.toaster.error('', response.Data.res_description, {
              positionClass: 'toast-top-center'
            });
          }
        }
      },
        error => console.log(error));
  }

  getCurrentLanguage() {
    this.newCustomerService.getCurrentLanguage$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(lang => this.currentLang = lang);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.customerInfoService.clearCurrentCustomerInfoByIdForCustomerInfoComponent();
    this.customerInfoService.createNewClicked();
    this.subscription$.next();
    this.subscription$.complete();
  }
}
