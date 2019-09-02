import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, Subscription, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';


import { ReceiptsService } from 'src/app/receipts/services/receipts.service';
import { TranslateService } from '@ngx-translate/core';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PaymentsService } from '../../payments.service';
import { CustomerType } from 'src/app/models/customerType.model';
import { Router } from '@angular/router';
import { NewPaymentService } from '../new-payment/new-payment.service';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css']
})
export class CustomerSearchComponent implements OnInit, OnDestroy {
  customerInfo: object;
  searchControl = new FormControl();
  filteredOptions: Observable<any[]>;
  CustomerSearchData: Observable<any[]>;

  cCustomerSearchData: any[] = [];
  AllCustomerTables: any[] = [];

  currentLang: string;
  step: number;
  cities: any[] = [];
  nameFilter: any[];
  customerTitle: { TitleEng: string, TitleHeb: string, TitleId: string }[] = []
  customerTypes: CustomerType[] = [];
  subscription$ = new Subject();
  private subscriptions: Subscription = new Subscription();

  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private translate: TranslateService,
    private spinner: NgxUiLoaderService,
    private paymentsService: PaymentsService,
    private router: Router,
    private newPaymentService: NewPaymentService
  ) { }

  ngOnInit() {
    this.spinner.start();
    // this.switchLanguage('he');
    this.LoadSystemTables();
    this.GetCustomerSearchData1();
    this.filterOption();
    // this.generalService.getLastSelectionFromLocalStore();
    this.subscriptions.add(this.generalService.currentLang$.subscribe(lang => this.currentLang = lang));
    // this.generalService.addSubscription(currentLang$);
    this.subscriptions.add(this.receiptService.currentStep$.subscribe(step => {
      this.step = step;
    }));
    // this.generalService.addSubscription(currentlyStep$);
    console.log('NEW RECEIPT SUBSCRIBE', this.subscriptions);
    this.getGlobalData();
    this.spinner.stop();
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
      this.customerInfo = customer;
      this.spinner.stop();
      this.newPaymentService.setFoundedCustomerId(customerId);
      console.log('FOUNDED CUSTOMER', customer);
    },
      error => console.log(error),
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
  LoadSystemTables() {
    if (this.generalService.checkLocalStorage('cities')) {
      this.cities = JSON.parse(this.generalService.checkLocalStorage('cities'));
    } else {
      this.subscriptions.add(this.generalService.GetSystemTables()
        .subscribe(
          response => {
            console.log('LoadSystemTables', response);
            // response = JSON.parse(response)
            if (response.IsError == true) {
              // this.disableAfterclick = false;
              // this.presentAlert(response.ErrMsg);
              alert('err');
            } else {
              // this.generalService.presentAlert("", "", "בוצע בהצלחה!");
              // console.log(response.Data);
              // console.log(JSON.parse(response.Data));
              // this.AllsysTables = JSON.parse(response.Data);
              // this.SelectRecType(1);
              this.cities = response.Cities;
              localStorage.setItem('cities', JSON.stringify(this.cities))
              console.log('this.cities', this.cities)
            }
          },
          error => {
            console.log(error);
            // this.generalService.presentAlert("Error", "an error accured", error.status);
            // this.disableAfterclick = false;
          },
          () => {
            console.log('CallCompleted');
          }
        ));
    }

  }
  getGlobalData() {
    this.paymentsService.currentGlobalData$.pipe(takeUntil(this.subscription$)).subscribe(data => {
      if (data) {
        this.customerTitle = data['CustomerTitle'];
        this.customerTypes = data['GetCustomerTypes']
      }
    })
  }
  newCustomerIsClicked() {
    this.receiptService.createNewEvent.next();
  }
  goToCreateNewPayment() {
    debugger
    this.router.navigate(['home/payments-grid/new-payment']);
    this.newPaymentService.setCustomerInfo(this.receiptService.getCustomerInfo());
  }
  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
