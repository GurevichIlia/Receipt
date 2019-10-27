import { GlobalData } from 'src/app/models/globalData.model';
import { CustomerAddresses } from './../../models/customer-info-by-ID.model';
import { CustomerPhones, FullCustomerDetailsById, CustomerEmails, MainDetails } from './../../models/fullCustomerDetailsById.model';
import { MainInfoService } from './main-info.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { CustomerTitle } from 'src/app/models/customerTitle.model';




@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.css'],
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
  animationState: string;
  constructor(
    private mainInfoService: MainInfoService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.createMainInfoForm();
    // this.getCustomerDetailsByIdState$();
    // this.getGlobalData();
    this.getChildMenuItem();
  }

  // getGlobalData() {
  //   this.globalData$ = this.mainInfoService.getGlobalData$().pipe(map(data => {
  //     if (data) {
  //       this.onFilterCustomerTitle(data.CustomerTitle)
  //     }
  //     return data
  //   }));
  // }

  // getCustomerDetailsByIdState$() {
  //   this.mainInfoService.getCustomerDetailsByIdState$()
  //     .pipe(
  //       filter(data => data !== null),
  //       map((data: FullCustomerDetailsById) => {
  //         // if (data !== null) {
  //         data.CustomerCard_MainDetails.map((details: MainDetails) => details.BirthDate = this.mainInfoService.changeDateFormat(details.BirthDate, 'DD-MM-YYYY'))
  //         return data;
  //         // }
  //       }),
  //       takeUntil(this.subscription$))
  //     .subscribe((data: FullCustomerDetailsById) => {
  //       if (data !== null) {
  //         // this.customerPhones = [...data.GetCustomerPhones.map((customerPhone: CustomerPhones) => {
  //         //   return this.mainInfoService.createNewObjectWithLowerCaseObjectKeys(customerPhone);
  //         // })];
  //         // this.customerEmails = [...data.CustomerEmails.map((customerEmails: CustomerEmails) => {
  //         //   return this.mainInfoService.createNewObjectWithLowerCaseObjectKeys(customerEmails);
  //         // })];
  //         // this.customerAddresses = [...data.CustomerAddresses.map((customerAddress: CustomerAddresses) => {
  //         //   return this.mainInfoService.createNewObjectWithLowerCaseObjectKeys(customerAddress);
  //         // })];
  //         this.customerDetails = [...data.CustomerCard_MainDetails];

  //         // this.setCustomerAddressFormControls();
  //         // this.setCustomerEmailFormControls();
  //         // this.setCustomerPhoneFormControls();
  //         // this.setCustomerPersonalInfo();

  //         this.mainInfoService.removeEmptyControl(this.phones, 'Phone');
  //         this.mainInfoService.removeEmptyControl(this.emails, 'email');
  //         this.mainInfoService.removeEmptyControl(this.addresses, 'street');
  //         this.mainInfoForm.disable();

  //       }
  //     })
  //   console.log('PHONES FORM', this.phones)
  // }


  createMainInfoForm() {
    this.mainInfoForm = this.fb.group({
      personalInfo: this.fb.group({
        fname: [''],
        lname: [''],
        birthDate: [''],
        company: [''],
        customerType: [''],
        title: [''],
        gender: [''],
        id: [''],
        spouseName: [''],
        fileAs: [''],
        afterSunset1: [''],
        remark: [''],
        contact: ['']
      }),
      phones: this.fb.array([
        // this.fb.group({
        //   phoneTypeId: [''],
        //   phoneNumber: ['', { disable: true }],
        //   Phone: ['', Validators.required],
        //   Prefix: ['972'],
        //   id: [''],
        //   Area: [''],
        //   publish: [''],
        //   isSms: [''],
        //   deleteRow: [''],
        //   comments: [''],
        // })
      ]
      ),
      emails: this.fb.array([
        // this.fb.group({
        //   emailName: [''],
        //   email: ['', [Validators.email, Validators.required]],
        //   tempid: [''],
        //   emailsex: [''],
        //   newslettere: [''],
        //   deleteRow: ['']
        // })
      ]
      ),
      addresses: this.fb.array([
        // this.fb.group({
        //   cityName: [''],
        //   street: [''],
        //   street2: [''],
        //   zip: [''],
        //   addressTypeId: [''],
        //   addressId: [''],
        //   remark: [''],
        //   mainaddress: [''],
        //   stateid: [''],
        //   deleteRow: ['']
        // })
      ])
    })

  }
  // get phones() {
  //   return this.mainInfoForm.get('phones') as FormArray;
  // }
  // get emails() {
  //   return this.mainInfoForm.get('emails') as FormArray;
  // }
  // get addresses() {
  //   return this.mainInfoForm.get('addresses') as FormArray;
  // }
  // get personalInfo() {
  //   return this.mainInfoForm.get('personalInfo') as FormGroup
  // }
  // get title() {
  //   return this.mainInfoForm.get('personalInfo.title')
  // }
  // addPhone(array: FormArray, fb: FormBuilder) {
  //   if (array.length < 10) {
  //     array.push(fb.group({
  //       phoneTypeId: [2],
  //       phoneNumber: ['', { disable: true }],
  //       Phone: ['', Validators.required],
  //       Prefix: ['972'],
  //       id: [''],
  //       publish: [''],
  //       isSms: [''],
  //       deleteRow: [''],
  //       comments: [''],
  //     }));
  //   }
  // }



  // deletePhone(array: FormArray, i) {
  //   this.mainInfoService.deletePhone(array, i);
  // }

  // deleteEmail(array: FormArray, i) {
  //   this.mainInfoService.deleteEmail(array, i);
  // }

  // deleteAddress(array: FormArray, i) {
  //   this.mainInfoService.deleteAddress(array, i);
  // }

  // deletePhone(array: FormArray, i) {
  //   if (array.length === 1) {
  //     return;
  //   } else if (confirm('Would you like to delete this field?')) {
  //     array.controls[i].value.deleteRow = 1;
  //     this.saveChangedCustomerData({ phones: [array.value[i]] })
  //     array.removeAt(i);
  //   }
  // }

  // deleteEmail(array: FormArray, i) {
  //   if (array.length === 1) {
  //     return;
  //   } else if (confirm('Would you like to delete this field ?')) {
  //     array.controls[i].value.deleteRow = 1;
  //     this.saveChangedCustomerData({ emails: [array.value[i]] })
  //     array.removeAt(i);
  //   }
  // }

  // deleteAddress(array: FormArray, i) {
  //   if (array.length === 1) {
  //     return;
  //   } else if (confirm('Would you like to delete this field?')) {
  //     array.controls[i].value.deleteRow = 1;
  //     this.saveChangedCustomerData({ addresses: [array.value[i]] });
  //     array.removeAt(i);
  //   }
  // }

  // deleteControl(array: FormArray, i) {
  //   if (array.length === 1) {
  //     return;
  //   }
  //   if (confirm('Would you like delete this?')) {
  //     array.controls[i].value.deleteRow = 1;
  //     this.saveChangedCustomerData({ phones: [array.value[i]] })
  //     console.log('DELETED PHONE', array.value[i]);
  //     array.removeAt(i);
  //   }

  // }

  // setCustomerPhoneFormControls() {
  //   this.mainInfoService.setPhoneInputsArray(this.mainInfoService.patchInputValue(this.phones, this.customerPhones, this.addPhone, this.fb) as FormArray);

  // }

  // setCustomerAddressFormControls() {
  //   this.mainInfoService.patchInputValue(this.addresses, this.customerAddresses, this.addAddress, this.fb)

  // }

  // setCustomerEmailFormControls() {
  //   this.mainInfoService.patchInputValue(this.emails, this.customerEmails, this.addEmail, this.fb)
  // }

  // setCustomerPersonalInfo() {
  //   this.mainInfoService.patchInputValue(this.personalInfo, this.customerDetails)
  // }

  // disableControls(event: { controlName: string, disable: boolean }) {
  //   const params = { ...event }
  //   switch (params.disable) {
  //     case true: this.mainInfoForm.get(params.controlName).enable();
  //       break;
  //     case false: this.mainInfoForm.get(params.controlName).disable();
  //       break;
  //   }
  // }

  // disableFormControl(control: AbstractControl) {
  //   control.disable();
  // }

  // enableFormControl(control: AbstractControl) {
  //   control.enable();
  // }

  // getActionFromChildren(newAction: { action: string, subject?: any | number }) {
  //   switch (newAction.action) {
  //     // case 'addNewPhone': this.addPhone(this.phones, this.fb); this.mainInfoService.setPhoneInputsArray(this.phones);
  //       // break
  //     case 'addNewEmail': this.addEmail(this.emails, this.fb);
  //       break
  //     case 'addNewAddress': this.addAddress(this.addresses, this.fb);
  //       break
  //     // case 'deletePhone': this.deletePhone(this.phones, newAction.subject);
  //       break
  //     case 'deleteAddress': this.deleteAddress(this.addresses, newAction.subject);
  //       break
  //     case 'deleteEmail': this.deleteEmail(this.emails, newAction.subject);
  //       break
  //     case 'editPhone': this.enableFormControl(this.phones.controls[newAction.subject]);
  //       break
  //     case 'editEmail': this.enableFormControl(this.emails.controls[newAction.subject]);
  //       break
  //     case 'editAddress': this.enableFormControl(this.addresses.controls[newAction.subject]);
  //       break
  //     case 'editPersonalInfo': this.enableFormControl(newAction.subject);
  //       break
  //     case 'savePhone': this.disableFormControl(this.phones.controls[newAction.subject]), this.saveChangedCustomerData(this.getEditedPhone(this.phones.controls[newAction.subject].value));
  //       break
  //     case 'saveEmail': this.disableFormControl(this.emails.controls[newAction.subject]), this.saveChangedCustomerData({ emails: [this.emails.controls[newAction.subject].value] });
  //       break
  //     case 'saveAddress': this.disableFormControl(this.addresses.controls[newAction.subject]), this.saveChangedCustomerData({ addresses: [this.addresses.controls[newAction.subject].value] });
  //       break
  //     case 'savePersonalInfo': this.disableFormControl(newAction.subject);
  //       break
  //   }
  // }

  // onFilterCustomerTitle(customerTitles: CustomerTitle[]) {
  //   this.filteredCustomerTitles$ = this.mainInfoService.customerTitleAutoComplete(customerTitles, this.title, 'TitleHeb');
  // }

  getChildMenuItem() {
    this.mainInfoService.getCurrentChildMenuItem$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((data: string) => this.currentMenuItem = data);
  }

  saveChangedCustomerData(newCustomerData: {}) {
    console.log('SENDING DATA TO SERVER', newCustomerData);
    if (newCustomerData) {
      this.mainInfoService.saveChangedCustomerData(newCustomerData)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: Response) => {
          // if (response.Data.error === 'false') {
          //   console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          // } else if (response.Data.error === 'true') {
          //   console.log('RESPONSE ERROR', response.Data.res_description);
          //   console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          // }
        },
          error => console.log(error));
    }
  }

  editPhone(phone: CustomerPhones) {
    const newPhone = Object.assign({}, phone);
    newPhone.isSms = +phone.isSms;
    newPhone.publish = +phone.publish;
    newPhone.Phone = phone.Area ? phone.Area + phone.Phone : phone.Phone;
    newPhone.Area = '';
    console.log('EDITED PHONE', { phones: [newPhone] });
    return { phones: [newPhone] };
  }

  getEditedPhone(phone: CustomerPhones) {
    return this.editPhone(phone);
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
