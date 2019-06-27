import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { GeneralSrv } from '../../services/GeneralSrv.service';
import { TranslateService } from '@ngx-translate/core';

import {

  FormControl,
  NgForm
} from '@angular/forms';
import {
  map,
} from 'rxjs/operators';
import {  HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceiptsService } from '../../services/receipts.service';


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
export class NewReceiptComponent implements OnInit, DoCheck, OnDestroy {
  customerInfo: object;
  myControl = new FormControl();
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
    private generalSrv: GeneralSrv,
    private authen: AuthenticationService,
    private router: Router,
    private httpClient: HttpClient,
    private receiptService: ReceiptsService,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private modal: MatDialog

  ) {
    translate.setDefaultLang('he');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLang = language;
    this.generalSrv.language.next(language);
    if (language === 'he') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
  }

  ngOnInit() {
    this.switchLanguage('he');
    this.LoadSystemTables();
    this.GetCustomerSearchData1();
    this.filterOption();
    this.generalSrv.getLastSelectionFromLocalStore();
    this.subscriptions.add(this.generalSrv.currentLang$.subscribe(lang => this.currentLang = lang));
    // this.generalSrv.addSubscription(currentLang$);
    this.subscriptions.add(this.receiptService.currentStep$.subscribe(step => {
      this.step = step;
    }));
    // this.generalSrv.addSubscription(currentlyStep$);
    this.checkExpToken();
    console.log('NEW RECEIPT SUBSCRIBE', this.subscriptions);
    this.receiptService.createNewEvent.subscribe(data => this.myControl.patchValue(''));
  }
  ngDoCheck() {
    // this.checkExpToken();
  }
  checkExpToken() {
    // const expTime = this.authService.getExpiration();
    // const date = new Date(0);
    // const tokenExpDate = date.setUTCSeconds(+expTime);
    // console.log('TOKE', tokenExpDate.valueOf())
    // console.log('DATE', new Date().valueOf())
    // if (tokenExpDate.valueOf() <= new Date().valueOf()) {
    //   console.log('TOKEN EXPIRED');
    // } else {
    //   console.log('TOKEN not EXPIRED');

    // }
  }
  test(event) {
    console.log(event)
  }

  filterOption() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        map(value => this._filter(value)),
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.AllCustomerTables.filter(user => user['FileAs1'].toLowerCase().includes(filterValue));

  }
  GetCustomerSearchData1() {
    this.subscriptions.add(this.generalSrv
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
          console.log('this.AllCustomerTables', this.AllCustomerTables);
        },
      ));

  }
  getCustomerInfoById(customerId: number) {
    this.subscriptions.add(this.generalSrv.getCustomerInfoById(customerId).subscribe(customer => {
      this.customerInfo = customer;
      // this.clickToBtnCreateNew = false;
      // this.receiptService.subject.next(customer);
      // this.receiptService.setCustomerInfo(customer);
    },
      error => console.log(error),
    ));
  }
  submit(form: NgForm) {
    console.log(form.value);
  }
  GetCustomerSearchData() {
    this.subscriptions.add(this.generalSrv.GetCustomerSearchData('jaffanet1').subscribe(
      response => {
        // response = JSON.parse(response);
        if (response.IsError == true) {
          // this.disableAfterclick = false;
          // this.presentAlert(response.ErrMsg);
          alert('err');
        } else {
          // this.generalSrv.presentAlert("", "", "בוצע בהצלחה!");
          console.log(response.Data);
          console.log(JSON.parse(response.Data));
          this.AllCustomerTables = JSON.parse(response.Data);

          this.CustomerSearchData = Object.assign(
            [],
            this.AllCustomerTables['CustomerTables'].FastSearchData
          );
        }
      },
      error => {
        console.log(error);
        // this.generalSrv.presentAlert("Error", "an error accured", error.status);
        // this.disableAfterclick = false;
      },
      () => {
        console.log('CallCompleted');
      }
    ));
  }
  createNew() {
    this.receiptService.createNewEvent.next();
    this.receiptService.setStep(1);
    this.myControl.patchValue('');
  }
  LoadSystemTables() {
    this.subscriptions.add(this.generalSrv.GetSystemTables('jaffanet1')
      .subscribe(
        response => {
          console.log('LoadSystemTables', response);
          // response = JSON.parse(response)
          if (response.IsError == true) {
            // this.disableAfterclick = false;
            // this.presentAlert(response.ErrMsg);
            alert('err');
          } else {
            // this.generalSrv.presentAlert("", "", "בוצע בהצלחה!");
            // console.log(response.Data);
            // console.log(JSON.parse(response.Data));
            // this.AllsysTables = JSON.parse(response.Data);
            // this.SelectRecType(1);
            this.cities = response.Cities;
            console.log('this.cities', this.cities)
          }
        },
        error => {
          console.log(error);
          // this.generalSrv.presentAlert("Error", "an error accured", error.status);
          // this.disableAfterclick = false;
        },
        () => {
          console.log('CallCompleted');
        }
      ));
  }

  logOut() {
    console.log('Is logOut')
    this.authen.logout();
    this.router.navigate(['login']);
  }
  ngOnDestroy() {
    console.log('NEW RECEIPT SUBSCRIBE', this.subscriptions);
    this.subscriptions.unsubscribe();
    console.log('NEW RECEIPT SUBSCRIBE On Destroy', this.subscriptions);

  }
}
