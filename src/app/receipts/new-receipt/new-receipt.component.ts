import { BehaviorSubject, Subject } from 'rxjs';
import { Component, OnInit, Injectable, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { GeneralSrv } from '../../services/GeneralSrv.service';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormControl,
  NgForm
} from '@angular/forms';
import {
  catchError,
  map,
  tap,
  startWith,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  takeWhile,
  first
} from 'rxjs/operators';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError, empty } from 'rxjs';
import { ReceiptsService } from '../../services/receipts.service';
import { ReceiptTypeComponent } from '../receipt-type/receipt-type.component';

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
export class NewReceiptComponent implements OnInit {
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

  constructor(
    private generalSrv: GeneralSrv,
    private authen: AuthenticationService,
    private router: Router,
    private httpClient: HttpClient,
    private receiptService: ReceiptsService
  ) {
    // debugger;
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(null),
    //   debounceTime(200),
    //   distinctUntilChanged(),
    //   switchMap(val => {
    //     return this.filter(val || "");
    //   })
    // );
    // debugger;
  }

  // filter(val: string): Observable<any[]> {
  //   debugger;
  //   console.log(this.filteredOptions);
  //   return this.generalSrv.getUsers().pipe(
  //     map(response =>
  //       response.filter(option => {
  //         return option.name.toLowerCase().indexOf(val.toLowerCase()) === 0;
  //       })
  //     )
  //   );
  // }

  // filter(val: string): Observable<any[]> {
  //   // debugger;
  //   // return this.CustomerSearchData.pipe(
  //   //   map(response =>
  //   //     response.filter(option => {
  //   //       return option.FilAs1.toLowerCase().indexOf(val.toLowerCase()) === 0;
  //   //     })
  //   //   )
  //   // );
  //   if (val == "") {
  //     return empty();
  //   }
  //   this.CustomerSearchData = Object.assign(
  //     [],
  //     this.AllCustomerTables["CustomerTables"].FastSearchData
  //   );

  //   // this.CustomerSearchData = Object.assign(
  //   //   [],
  //   //   this.AllCustomerTables["CustomerTables"].FastSearchData.filter(
  //   //     e => e.FilAs1.indexOf(val) === 0
  //   //     // e => e.FilAs1.toLowerCase().indexOf(val.toLowerCase()) === 0
  //   //   )
  //   // );
  //   return this.CustomerSearchData;
  // }

  // filter(val: string): Observable<any[]> {
  //   this.filteredOptions = this.generalSrv.getUsers();

  //   debugger;
  //   // this.cCustomerSearchData = this.CustomerSearchData.filter(
  //   //   e => e.FileAs1.toLowerCase().indexOf(val.toLowerCase()) === 0
  //   //   // e => e.FileAs1 == "מצליח שלמה"
  //   // );

  //   // this.ReceiptTypes = this.ReceiptTypes.filter(
  //   //   e =>
  //   //     e.DonationReceipt == this.Selected_receiptIsForDonation &&
  //   //     e.UseAsCreditReceipt == this.Selected_receiptCreditOrDebit
  //   // );

  //   return this.cCustomerSearchData;
  // }

  // this.ReceiptTypes =

  ngOnInit() {
    // this.LoadSystemTables();
    this.GetCustomerSearchData1();
    this.filterOption();
  }
  test(event) {
    console.log(event)
  }

  filterOption() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.AllCustomerTables.filter(user => user['FileAs1'].toLowerCase().includes(filterValue));
  }

  GetCustomerSearchData1() {
    this.generalSrv
      .getUsers()
      .pipe(
        map(response => response)
      ).subscribe(
        data => {
          this.AllCustomerTables = data;
          console.log(this.AllCustomerTables);
        },
        error => console.log(error)
      );

  }
  getCustomerInfoById(customerId: number) {
    this.generalSrv.getCustomerInfoById(customerId).subscribe(customer => {
      this.customerInfo = customer;
      // this.clickToBtnCreateNew = false;
      // this.receiptService.subject.next(customer);
      // this.receiptService.setCustomerInfo(customer);
    },
      error => console.log(error),
    );
  }
  submit(form: NgForm) {
    console.log(form.value);
  }
  GetCustomerSearchData() {
    this.generalSrv.GetCustomerSearchData('jaffanet1').subscribe(
      response => {
        // response = JSON.parse(response);
        debugger;
        if (response.IsError == true) {
          // this.disableAfterclick = false;
          // this.presentAlert(response.ErrMsg);
          alert('err');
        } else {
          // this.generalSrv.presentAlert("", "", "בוצע בהצלחה!");
          debugger;
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
        debugger;
        // this.generalSrv.presentAlert("Error", "an error accured", error.status);
        // this.disableAfterclick = false;
      },
      () => {
        console.log('CallCompleted');
      }
    );
  }
  createNew() {
    this.receiptService.createNewEvent.next();
    this.receiptService.setStep(1);
    this.myControl.patchValue('');
  }
  LoadSystemTables() {
    this.generalSrv.GetSystemTables('amaxamax')
      .subscribe(
        response => {
          console.log('LoadSystemTables', response);
          // response = JSON.parse(response);
          debugger;
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
            debugger;
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
      );
  }

  LogOut() {
    this.authen.logout();
  }
}
