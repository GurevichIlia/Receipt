import { takeUntil, take } from 'rxjs/operators';
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
  constructor(
    // private mainInfoService: MainInfoService,
    private phonesService: PhonesService
  ) { }

  get phones() {
    return this.mainInfoForm.get('phones') as FormArray;
  }

  ngOnInit() {

    const add = x => y => {
      const z = x + y;
      console.log(x + '+' + y + '=' + z);
      return z;
    };

    const res = add(3)(6); // вернёт 9 и выведет в консоль 3+6=9

    console.log(res);
    this.getCustomerPhones();

  }

  getCustomerPhones() {
    this.phonesService.getCustomerDetailsByIdState$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((customerDetails: FullCustomerDetailsById) => {
        console.log('GOT CUSTOMER DETAILS', customerDetails);
        if (customerDetails) {
          this.customerPhones = customerDetails.GetCustomerPhones;

          this.createPhoneInputsArray(this.phones, this.customerPhones);
          this.connectAreaWithPhone();
        }
      });
  }

  createPhoneInputsArray(phoneInputsArray: FormArray, customerPhones: CustomerPhones[]) {
    this.phonesService.createPhoneInputsArray(phoneInputsArray, customerPhones);
  }


  getAction(event: { action: string, index?: number }) {
    debugger
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
    if (phone.Phone.trim().length >= 7) {
      this.phonesService.savePhoneOnServer(phone)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: Response) => {
          if (response.Data.error === 'false') {
            this.disableFormControl(array.controls[i]);
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
    if (array.length === 1) {
      return;
    } else if (confirm('Would you like to delete this field?')) {
      this.phonesService.deletePhone(phone)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: Response) => {
          if (response.Data.error === 'false') {
            array.removeAt(i);
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
