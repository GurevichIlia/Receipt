import { takeUntil, take, map } from 'rxjs/operators';
import { FullCustomerDetailsById, CustomerPhones } from './../../../models/fullCustomerDetailsById.model';
import { PhonesService, Phone } from './phones.service';
import { MainInfoService } from './../main-info.service';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, } from '@angular/forms';
import { Subject } from 'rxjs';
import { Response } from 'src/app/models/response.model';

@Component({
  selector: 'app-phones-info',
  templateUrl: './phones-info.component.html',
  styleUrls: ['./phones-info.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhonesInfoComponent implements OnInit, OnDestroy {
  @Input() mainInfoForm: FormGroup
  customerPhones: CustomerPhones[];
  subscription$ = new Subject();
  loading = true;
  newEvent: { action: string, index?: number };

  constructor(
    // private mainInfoService: MainInfoService,
    private phonesService: PhonesService
  ) { }

  get phones() {
    return this.mainInfoForm.get('phones') as FormArray;
  }

  ngOnInit() {

    console.log(this.phones);
    this.getCustomerPhones();

  }

  getCustomerPhones() {
    this.phonesService.getCustomerDetailsByIdState$()
      .pipe(
        map(details => details.GetCustomerPhones),
        takeUntil(this.subscription$))
      .subscribe((customerPhones: CustomerPhones[]) => {
        console.log('GOT CUSTOMER PHONES', customerPhones);
        if (customerPhones) {
          this.customerPhones = customerPhones;

          this.createPhoneInputsArray(this.phones, this.customerPhones);
          this.connectAreaWithPhone();
          this.loading = false;
        }
      });
  }

  createPhoneInputsArray(phoneInputsArray: FormArray, customerPhones: CustomerPhones[]) {
    this.phonesService.createPhoneInputsArray(phoneInputsArray, customerPhones);
  }


  getAction(event: { action: string, index?: number }) {
    switch (event.action) {
      case 'addNewPhone': this.addPhoneInput(this.phones, event.index);
        break
      case 'deletePhone': this.deletePhone(this.phones, event.index);
        break
      case 'savePhone': this.savePhone(this.phones, event.index);
        break
      case 'editPhone': this.editPhone(this.phones, event.index);
        break
    }

  }

  editPhone(array: FormArray, i) {
    this.phonesService.enableFormControl(array.controls[i]);
  }

  savePhone(array: FormArray, i) {
    const phone: Phone = array.controls[i].value;
    if (array.controls[i].valid) {
      this.loading = true;
      this.phonesService.savePhoneOnServer(phone)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: Response) => {
          if (response.Data.error === 'false') {
            this.disableFormControl(array.controls[i]);
            this.loading = false;
            this.phonesService.updateCustomerInfo();
            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          } else if (response.Data.error === 'true') {
            console.log('RESPONSE ERROR', response.Data.res_description);
            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          }
        },
          error => console.log(error));

    } else {
      alert('Please enter correct number');
      array.removeAt(i);
    }


  }

  addPhoneInput(array: FormArray, i) {
    this.phonesService.addPhone(array);
  }

  deletePhone(array: FormArray, i) {
    const phone: Phone = array.controls[i].value;
    if (!phone.id) {
      array.removeAt(i);
    } else if (array.length === 1) {
      return;
    } else if (confirm('Would you like to delete this field?')) {
      this.phonesService.deletePhone(phone)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: Response) => {
          if (response.Data.error === 'false') {
            array.removeAt(i);
            this.phonesService.updateCustomerInfo();
            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          } else if (response.Data.error === 'true') {
            console.log('RESPONSE ERROR', response.Data.res_description);
            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          }
        },
          error => console.log(error));
    }
  }

  disableFormControl(control: AbstractControl) {
    control.disable();
  }

  enableFormControl(control: AbstractControl) {
    control.enable();
  }

  connectAreaWithPhone() {
    this.phones.value.map((phone: CustomerPhones) => phone.area ? phone.phone = phone.area + phone.phone : phone.phone = phone.phone);
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
    this.mainInfoForm.get('phones').disable({ onlySelf: true });
    // this.mainInfoService.removeEmptyControl(this.phones, 'Phone');
  }

}
