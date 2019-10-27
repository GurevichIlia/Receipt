import { MainInfoService } from './../main-info.service';
import { CustomerPhones } from './../../../models/fullCustomerDetailsById.model';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

export interface Phone {
  phoneTypeId: number;
  phoneNumber: string;
  Phone: string;
  Prefix: string;
  publish: number;
  isSms: number;
  deleteRow: number;
  comments: string;
  area: string
}

@Injectable({
  providedIn: 'root'
})
export class PhonesService {
  phoneInputsArray = new BehaviorSubject<FormArray>(null);
  phoneInputsArray$ = this.phoneInputsArray.asObservable();

  constructor(
    private fb: FormBuilder,
    private mainInfoService: MainInfoService
  ) { }

  setPhoneInputsArray(phoneInputsArray: FormArray) {
    this.phoneInputsArray.next(phoneInputsArray);
  }

  getPhoneInputsArray$() {
    return this.phoneInputsArray$
  }

  getCustomerDetailsByIdState$(){
  return this.mainInfoService.getCustomerDetailsByIdState$();
}

  createPhoneInputsArray(phoneInputsArray: FormArray, customerPhones: CustomerPhones[]) {
    console.log('METHOD IS STARTED');
    phoneInputsArray.controls = []; // Очищаю массив потому что какого то хуя вызывается этот метод дважды. Пока не понял почему.
    if (customerPhones.length > 0) {
      for (let i = 0; i < customerPhones.length; i++) {
        this.addPhone(phoneInputsArray);
        this.disableFormControl(phoneInputsArray.controls[i]);
        if (i < 10) {
          phoneInputsArray.controls[i].patchValue({
            area: customerPhones[i].Area,
            phoneTypeId: customerPhones[i].PhoneTypeId,
            phoneNumber: customerPhones[i].Area + customerPhones[i].PhoneNumber,
            Phone: customerPhones[i].Phone,
            Prefix: customerPhones[i].Prefix,
            id: customerPhones[i].Id,
            publish: customerPhones[i].publish,
            isSms: customerPhones[i].IsSms,
            deleteRow: '',
            comments: customerPhones[i].Comments,
          })
          console.log(phoneInputsArray.value)
        }
      }
    }
    console.log('PHONES ARRAY FROM PHONE SERVICE', phoneInputsArray);
  }

  addPhone(array: FormArray) {
    if (array.length < 10) {
      array.push(this.fb.group({
        area: [''],
        phoneTypeId: [2],
        phoneNumber: [''],
        Phone: ['', [Validators.required, Validators.minLength(7)]],
        Prefix: ['972'],
        id: [''],
        publish: [''],
        isSms: [''],
        deleteRow: [''],
        comments: [''],
      }));
    }
  }

  deletePhone(phone: Phone) {
    phone.deleteRow = 1; // Чтобы удалился объект deletRow должно быть равно 1;
    return this.mainInfoService.saveChangedCustomerData({ phones: [phone] })
  }

  savePhoneOnServer(phone: Phone) {
    phone = this.editPhoneBeforSave(phone);
    return this.mainInfoService.saveChangedCustomerData({ phones: [phone] });
  }

  disableFormControl(control: AbstractControl) {
    control.disable();
  }

  enableFormControl(control: AbstractControl) {
    control.enable();
  }

  editPhoneBeforSave(phone: Phone) {
    const newPhone = Object.assign({}, phone);
    newPhone.isSms = +phone.isSms;
    newPhone.publish = +phone.publish;
    newPhone.Phone = phone.area ? phone.area + phone.Phone : phone.Phone;
    newPhone.area = '';
    console.log('EDITED PHONE', { phones: [newPhone] });
    return newPhone;
  }
}
