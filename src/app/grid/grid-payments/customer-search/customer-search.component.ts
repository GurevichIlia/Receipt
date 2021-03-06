import { CustomerGroupsService } from './../../../core/services/customer-groups.service';
import { GlobalStateService } from './../../../shared/global-state-store/global-state.service';
import { CustomerPhones, CustomerEmails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerInfoById, CustomerAddresses, CustomerInfoForReceiept } from './../../../models/customer-info-by-ID.model';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, Subscription, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';


import { ReceiptsService } from 'src/app/shared/services/receipts.service';
import { GeneralSrv } from 'src/app/shared/services/GeneralSrv.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PaymentsService } from '../../payments.service';
import { CustomerType } from 'src/app/models/customerType.model';
import { Router } from '@angular/router';
import { NewPaymentService } from '../new-payment/new-payment.service';
import { CustomerInfoService, CustomerInfoByIdForCustomerInfoComponent } from 'src/app/shared/share-components/customer-info/customer-info.service';
import { GlobalEventsService } from 'src/app/core/services/global-events.service';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css']
})
export class CustomerSearchComponent implements OnInit, OnDestroy {
  @Output() foundCustomerDetails = new EventEmitter();
  customerInfo: object;
  searchControl = new FormControl();
  filteredOptions$: Observable<any[]>;
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
  title = 'Create a new keva'
  kevaMode: string = ''
  private subscriptions: Subscription = new Subscription();

  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private spinner: NgxUiLoaderService,
    private paymentsService: PaymentsService,
    private router: Router,
    private newPaymentService: NewPaymentService,
    private customerInfoService: CustomerInfoService,
    private globalStateService: GlobalStateService,
    private customerGroupsService: CustomerGroupsService,
    private globalEventsService: GlobalEventsService
  ) { }

  ngOnInit() {
    this.spinner.start();
    // this.switchLanguage('he');
    this.getCities();
    this.getCustomerSearchData();
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
    this.checkKevaMode();
    this.getCustomerId$();
  }

  filterOption() {
    this.filteredOptions$ = this.searchControl.valueChanges
      .pipe(
        map(value => this._filter(value)),
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.AllCustomerTables.filter(user => user['FileAs1'].toLowerCase().includes(filterValue));

  }

  checkKevaMode() {
    this.newPaymentService.kevaMode$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((kevaMode: string) => {
        if (kevaMode) {
          this.kevaMode = kevaMode;
          if (kevaMode === 'duplicate') {
            this.title = 'Duplicate the keva'
          } else if (kevaMode === 'newKeva') {
            this.title = 'Create a new keva'
          }
        }
      })

  }

  getCustomerSearchData() {
    this.globalStateService.getCustomerSearchList$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(
        data => {
          this.AllCustomerTables = data;
        },
      );
  }


  getCustomerInfoById(customerId: number) {
    this.spinner.start();
    this.subscriptions.add(this.generalService.getCustomerInfoById(customerId).subscribe(customer => {
      if (customer) {
        console.log('CUSTOMER INFO FOR NEW KEVA FROM SERVER', customer);
        this.customerGroupsService.clearSelectedGroups();

        // this.outputCustomerDetails(customer);
        // this.customerInfoService.setCustomerInfoById(customer.CustomerEmails, customer.CustomerMobilePhones, customer.CustomerAddresses, customer.CustomerInfoForReceiept, customer.CustomerCreditCardTokens);
        this.customerInfoService.setCurrentCustomerInfoByIdState(this.transformCustomerDetailsForCustomerInfoComponent(customer));
        // this.customerInfoService.setCustomerGroupList(customer.CustomerGroupsGeneralSet);
        this.customerGroupsService.setAlreadySelectedGroupsFromCustomerInfo(customer.CustomerGroupsGeneralSet.map(group => group.CustomerGeneralGroupId));
        this.searchControl.patchValue('');

        // this.newPaymentService.setFoundedCustomerId(customerId);
        // console.log('FOUNDED CUSTOMER', customer);
      }
      this.spinner.stop();

    },
      error => console.log(error),
    ));
  }

  submit(form: NgForm) {
    console.log(form.value);
  }


  getCities() {
    this.globalStateService.getCities$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(cities => this.cities = cities);
  }

  getGlobalData() {
    this.generalService.getGlobalData$().pipe(takeUntil(this.subscription$)).subscribe(data => {
      if (data) {
        this.customerTitle = data['CustomerTitle'];
        this.customerTypes = data['GetCustomerTypes']
      }
    })
  }

  newCustomerIsClicked() {
    this.customerInfoService.createNewClicked();
    this.searchControl.patchValue('');

  }

  goToCreateNewPayment() {
    this.customerInfoService.getCurrentCustomerInfoByIdForCustomerInfoComponent$()
      .pipe(
        map(customerInfo => {
          customerInfo.customerAddress.filter(address => {
            for (let item in address) {
              address[item] = address[item] === null ? '' : address[item];
            }
            return address
          })
          return customerInfo
        }
        ),
        takeUntil(this.subscription$))
      .subscribe(customerInfo => {

        this.newPaymentService.setCustomerInfoForNewKeva(customerInfo);
        this.router.navigate(['payments-grid/new-payment']);

      })

  }

  outputCustomerDetails(customerDetails: CustomerInfoById) {
    console.log('OUTPUT CUSTOMER', customerDetails)
    this.foundCustomerDetails.emit(customerDetails);
  }

  transformCustomerDetailsForCustomerInfoComponent(customerDetails: CustomerInfoById) {
    const newObject: CustomerInfoByIdForCustomerInfoComponent = {
      customerEmails: customerDetails.CustomerEmails.map((email: CustomerEmails) => {
        const changedEmail = {
          emailName: email.EmailName,
          email: email.Email
        }
        return changedEmail;
      }),
      customerPhones: customerDetails.CustomerMobilePhones.map((phone: CustomerPhones) => {
        const changedPhone = {
          phoneTypeId: phone.PhoneTypeId,
          phoneNumber: phone.PhoneNumber
        }
        return changedPhone;
      }),
      customerAddress: customerDetails.CustomerAddresses.map((address: CustomerAddresses) => {
        const changedAddress = {
          cityName: address.CityName,
          street: address.Street,
          street2: address.Street2,
          zip: address.Zip,
          addressTypeId: address.AddressTypeId,
          mainAddress: address.MainAddress
        }
        return changedAddress;
      }),
      customerMainInfo: customerDetails.CustomerInfoForReceiept.map((mainInfo: CustomerInfoForReceiept) => {
        const changedMainInfo = {
          customerId: mainInfo.CustomerId,
          fname: mainInfo.fname,
          lname: mainInfo.lname,
          company: mainInfo.Company,
          customerType: mainInfo.CustomerType,
          title: mainInfo.Title,
          gender: mainInfo.Gender,
          customerCode: mainInfo.CustomerCode,
          spouseName: mainInfo.SpouseName,
          fileAs: mainInfo.FileAs,
          birthday: mainInfo.BirthDate,
          afterSunset1: mainInfo.AfterSunset1
        }
        return changedMainInfo
      }),
      customerGroups: customerDetails.CustomerGroupsGeneralSet.map(group => {
        return { GroupId: group.CustomerGeneralGroupId }
      })

    }
    return newObject
  }

  getCustomerId$() {
    this.globalEventsService.getCustomerIdForSearch$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(customerId => {
        this.getCustomerInfoById(customerId)
      })

  }


  ngOnDestroy() {
    this.globalEventsService.setCustomerIdForSearch(null);
    // this.newPaymentService.setKevaMode('newKeva');
    this.subscription$.next();
    this.subscription$.complete();
  }
}
