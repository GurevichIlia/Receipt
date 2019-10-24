import { CustomerInfoService } from './../customer-info/customer-info.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { CustomerInfoById } from 'src/app/models/customer-info-by-ID.model';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { Subscription } from 'rxjs';

import { map, } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ReceiptsService } from '../services/receipts.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


///////////////////////// START CLASS

// @Injectable()
// export class Service {
//   constructor(private httpClient: HttpClient) {}

//   getUsers(): Observable<any[]> {
//     return this.httpClient.get<any>(
//       "https://jsonplaceholder.typicode.com/users"
//     );
//   }
// }

///////////////////////// END CLASS

////////////// START COMPONNET


@Component({
  selector: 'app-new-receipt',
  templateUrl: './new-receipt.component.html',
  styleUrls: ['./new-receipt.component.css']
})
export class NewReceiptComponent implements OnInit, OnDestroy {
  customerInfo: CustomerInfoById;
  searchControl = new FormControl();
  filteredOptions: Observable<any[]>;
  CustomerSearchData: Observable<any[]>;

  cCustomerSearchData: any[] = [];
  AllCustomerTables: any[] = [];


  firstName: object;
  lastName: string;
  AllsysTables: any;
  clickToBtnCreateNew = false;
  receiptCurrencyId: string;

  currentLang: string;
  step: number;
  cities: any[] = [];
  nameFilter: any[];

  private subscriptions: Subscription = new Subscription();
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv, private translate: TranslateService,
    private spinner: NgxUiLoaderService,
    private customerInfoService: CustomerInfoService

  ) {
    translate.setDefaultLang('he');
  }

  // switchLanguage(language: string) {
  //   this.translate.use(language);
  //   this.currentLang = language;
  //   this.generalService.language.next(language);
  //   if (language === 'he') {
  //     document.body.setAttribute('dir', 'rtl');
  //   } else {
  //     document.body.setAttribute('dir', 'ltr');
  //   }
  // }

  ngOnInit() {
    this.receiptService.setStep(1);
    // this.spinner.start();
    // this.switchLanguage('he');
    this.GetCustomerSearchData1();
    this.filterOption();
    this.generalService.getLastSelectionFromLocalStore();
    this.subscriptions.add(this.generalService.currentLang$.subscribe(lang => this.currentLang = lang));
    // this.generalService.addSubscription(currentLang$);
    this.subscriptions.add(this.receiptService.currentStep$.subscribe(step => {
      this.step = step;
    }));
    // this.generalService.addSubscription(currentlyStep$);
    console.log('NEW RECEIPT SUBSCRIBE', this.subscriptions);
    this.receiptService.createNewEvent.subscribe(data => this.searchControl.patchValue(''));
    // this.spinner.stop();
  }

  filterOption() {
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        map(value => this._filter(value)),
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.AllCustomerTables.filter(user => user['FileAs1'].toLowerCase().includes(filterValue));

  }
  GetCustomerSearchData1() {
    if (this.generalService.checkLocalStorage('customerSearchData')) {
      this.AllCustomerTables = JSON.parse(this.generalService.checkLocalStorage('customerSearchData'))
    } else {
      this.subscriptions.add(this.generalService
        .getUsers()
        .pipe(
          map(response => {
            if (response.length === 0) {
              // this.authService.logout();
              return response;
            } else {
              return response;
            }
          }),
          map(response => response),
        ).subscribe(
          data => {
            this.AllCustomerTables = data;
            this.AllCustomerTables = this.AllCustomerTables.filter(data => String(data['FileAs1']) != ' ');
            localStorage.setItem('customerSearchData', JSON.stringify(this.AllCustomerTables));
            console.log('this.AllCustomerTables', this.AllCustomerTables);
          },
        ));
    }
  }
  getCustomerInfoById(customerId: number) {
    this.spinner.start();
    this.subscriptions.add(this.generalService.getCustomerInfoById(customerId).subscribe(customer => {
      this.customerInfoService.setCustomerInfoById(
        customer.CustomerEmails,
        customer.CustomerMobilePhones,
        customer.CustomerAddresses,
        customer.CustomerInfoForReceiept,
        customer.CustomerCreditCardTokens,
        customer.QuickGeneralGroupList
      );
      this.customerInfo = customer;
      this.spinner.stop();
    },
      error => {
        console.log(error),
          this.spinner.stop();
      },
    ));
  }
  submit(form: NgForm) {
    console.log(form.value);
  }
  createNew() {
    this.receiptService.createNewEvent.next();
    this.receiptService.setStep(1);
    this.searchControl.patchValue('');
  }


  // logOut() {
  //   console.log('Is logOut')
  //   this.authen.logout();
  //   this.router.navigate(['login']);
  // }
  ngOnDestroy() {
    console.log('NEW RECEIPT SUBSCRIBE', this.subscriptions);
    this.receiptService.createNewEvent.next();
    this.subscriptions.unsubscribe();
    console.log('NEW RECEIPT SUBSCRIBE On Destroy', this.subscriptions);

  }
}
