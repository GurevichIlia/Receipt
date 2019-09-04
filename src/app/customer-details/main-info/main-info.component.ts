import { ActivatedRoute } from '@angular/router';
import { ConfirmPurchasesComponent } from './../../receipts/modals/confirm-purchases/confirm-purchases.component';
import { GlobalData } from 'src/app/models/globalData.model';
import { CustomerAddresses } from './../../models/customer-info-by-ID.model';
import { CustomerPhones, FullCustomerDetailsById, CustomerEmails, MainDetails } from './../../models/fullCustomerDetailsById.model';
import { MainInfoService } from './main-info.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { takeUntil, map, filter, startWith } from 'rxjs/operators';
import { Subject, Observable, config, BehaviorSubject } from 'rxjs';
import { CustomerTitle } from 'src/app/models/customerTitle.model';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.css']
})
export class MainInfoComponent implements OnInit {
  mainInfoForm: FormGroup;
  subscription$ = new Subject();
  customerPhones: CustomerPhones[];
  customerEmails: CustomerEmails[];
  customerAddresses: CustomerAddresses[];
  customerDetails: MainDetails[];
  globalData$: Observable<GlobalData>;
  filteredCustomerTitles$: Observable<CustomerTitle[]>;
  currentMenuItem = 'personalInfo';
  constructor(
    private mainInfoService: MainInfoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.createMainInfoForm();
    this.getMainInfo();
    this.getGlobalData();
    this.getChildMenuItem();
  }
  getGlobalData() {
    this.globalData$ = this.mainInfoService.getGlobalData$().pipe(map(data => {
      this.customerTitleAutoComplete(data.CustomerTitle);
      return data
    }));
  }
  getMainInfo() {
    this.mainInfoService.getMainInfo()
      .pipe(
        filter(data => data !== null),
        map((data: FullCustomerDetailsById) => {
          // if (data !== null) {
          data.CustomerCard_MainDetails.map((details: MainDetails) => details.BirthDate = this.mainInfoService.changeDateFormat(details.BirthDate, 'YYYY-MM-DD'))
          return data;
          // }
        }),
        takeUntil(this.subscription$))
      .subscribe((data: FullCustomerDetailsById) => {
        if (data !== null) {
          this.customerPhones = [...data.GetCustomerPhones];
          this.customerEmails = [...data.CustomerEmails];
          this.customerAddresses = [...data.CustomerAddresses];
          this.customerDetails = [...data.CustomerCard_MainDetails]
          this.setCustomerAddressFormControls();
          this.setCustomerEmailFormControls();
          this.setCustomerPhoneFormControls();
          this.setCustomerPersonalInfo();
          this.mainInfoService.removeEmptyControl(this.phones);

          this.mainInfoService.removeEmptyControl(this.emails);
          this.mainInfoService.removeEmptyControl(this.addresses);
          this.mainInfoForm.disable();

        }
      })
  }


  createMainInfoForm() {
    this.mainInfoForm = this.fb.group({
      personalInfo: this.fb.group({
        fname: [''],
        lname: [''],
        BirthDate: [''],
        Company: [''],
        CustomerType: [''],
        Title: [''],
        Gender: [''],
        ID: [''],
        SpouseName: [''],
        FileAs: [''],
        AfterSunsetnumber: [''],
      }),
      phones: this.fb.array([
        this.fb.group({
          PhoneTypeId: [''],
          PhoneNumber: ['']
        })
      ]
      ),
      emails: this.fb.array([
        this.fb.group({
          EmailName: [''],
          Email: ['', Validators.email],
        })
      ]
      ),
      addresses: this.fb.array([
        this.fb.group({
          CityName: [''],
          Street: [''],
          Street2: [''],
          Zip: [''],
          AddressTypeId: ['']
        })
      ])
    })

  }
  get phones() {
    return this.mainInfoForm.get('phones') as FormArray;
  }
  get emails() {
    return this.mainInfoForm.get('emails') as FormArray;
  }
  get addresses() {
    return this.mainInfoForm.get('addresses') as FormArray;
  }
  get personalInfo() {
    return this.mainInfoForm.get('personalInfo') as FormGroup
  }
  get title() {
    return this.mainInfoForm.get('personalInfo.Title')
  }
  addPhone(array: FormArray, fb: FormBuilder) {
    if (array.length < 10) {
      array.push(fb.group({
        PhoneTypeId: [2],
        PhoneNumber: ['']
      }));
    }

  }
  addEmail(array: FormArray, fb: FormBuilder) {
    if (array.length < 10) {
      array.push(fb.group({
        EmailName: [''],
        Email: [''],
      }));
    }
  }
  addAddress(array: FormArray, fb: FormBuilder) {
    if (array.length < 10) {
      array.push(fb.group({
        CityName: [''],
        Street: [''],
        Street2: [''],
        Zip: [''],
        AddressTypeId: ['']
      }))
    }
  }
  deletePhone(i) {
    if (this.phones.length === 1) {
      return;
    } else {
      this.phones.removeAt(i);
    }
  }
  deleteControl(array: FormArray, i) {
    if (array.length === 1) {
      return;
    } else {
      // const confirm = this.dialog.open(ConfirmPurchasesComponent, { width: '400px', height: '150px', data: 'Would you like delete this?' })
      // confirm.afterClosed().subscribe(data => {

      //   data === true ? array.removeAt(i) : ''
      // })
      if (confirm('Would you like delete this?')) {
        array.removeAt(i)
      }
      // array.controls.map(data => {
      //   const newdata = { ...data }
      //   return newdata;
      // })
      // this._phones.next(array);
    }
  }
  setCustomerPhoneFormControls() {
    this.mainInfoService.patchInputValue(this.phones, this.customerPhones, this.addPhone, this.fb);

  }
  setCustomerAddressFormControls() {
    this.mainInfoService.patchInputValue(this.addresses, this.customerAddresses, this.addAddress, this.fb)

  }
  setCustomerEmailFormControls() {
    this.mainInfoService.patchInputValue(this.emails, this.customerEmails, this.addEmail, this.fb)
  }
  setCustomerPersonalInfo() {
    this.mainInfoService.patchInputValue(this.personalInfo, this.customerDetails)
  }

  disableControls(event: { controlName: string, disable: boolean }) {
    const params = { ...event }
    switch (params.disable) {
      case true: this.mainInfoForm.get(params.controlName).enable();
        break;
      case false: this.mainInfoForm.get(params.controlName).disable();
        break;
    }
  }
  disableFormControl(control: AbstractControl) {
    control.disable();
  }
  enableFormControl(control: AbstractControl) {
    control.enable();
  }
  customerTitleAutoComplete(filteredSubject: CustomerTitle[]) {
    if (filteredSubject) {
      this.filteredCustomerTitles$ = this.title.valueChanges
        .pipe(
          startWith(''),
          map(value => this.filter(value, filteredSubject))
        );
    }
  }
  private filter(value: string, filteredSubject: CustomerTitle[]): { TitleEng: string, TitleHeb: string, TitleId: number }[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return filteredSubject.filter((title: CustomerTitle) => title.TitleHeb.toLowerCase().includes(filterValue))
  }
  getActionFromChildren(newAction: { action: string, subject?: any | number }) {
    switch (newAction.action) {
      case 'addNewPhone': this.addPhone(this.phones, this.fb);
        break
      case 'addNewEmail': this.addEmail(this.emails, this.fb);
        break
      case 'addNewAddress': this.addAddress(this.addresses, this.fb);
        break
      case 'deletePhone': this.deleteControl(this.phones, newAction.subject);
        break
      case 'deleteAddress': this.deleteControl(this.addresses, newAction.subject);
        break
      case 'deleteEmail': this.deleteControl(this.emails, newAction.subject);
        break
      case 'editPhone': this.enableFormControl(this.phones.controls[newAction.subject]);
        break
      case 'editEmail': this.enableFormControl(this.emails.controls[newAction.subject]);
        break
      case 'editAddress': this.enableFormControl(this.addresses.controls[newAction.subject]);
        break
      case 'editPersonalInfo': this.enableFormControl(newAction.subject);
        break
      case 'savePhone': this.disableFormControl(newAction.subject);
        break
      case 'saveEmail': this.disableFormControl(newAction.subject);
        break
      case 'saveAddress': this.disableFormControl(newAction.subject);
        break
      case 'savePersonalInfo': this.disableFormControl(newAction.subject);
        break
    }
  }
  getChildMenuItem() {
    this.mainInfoService.getCurrentChildMenuItem$().subscribe((data: string) => this.currentMenuItem = data);
  }
  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
