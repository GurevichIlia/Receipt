import { CustomerEmails } from './../../../models/fullCustomerDetailsById.model';
import { Injectable } from '@angular/core';
import { FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MainInfoService } from '../main-info.service';

export interface Email {
  emailName: string;
  email: string;
  tempid: number;
  emailsex: string;
  newslettere: string;
  deleteRow: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  constructor(
    private fb: FormBuilder,
    private mainInfoService: MainInfoService

  ) { }


  getCustomerDetailsByIdState$() {
    return this.mainInfoService.getCustomerDetailsByIdState$();
  }


  createEmailInputsArray(emailInputsArray: FormArray, customerEmails: CustomerEmails[]) {
    console.log('METHOD IS STARTED');
    emailInputsArray.controls = []; // Очищаю массив потому что какого то хуя вызывается этот метод дважды. Пока не понял почему.
    if (customerEmails.length > 0) {
      for (let i = 0; i < customerEmails.length; i++) {
        this.addEmail(emailInputsArray);
        this.disableFormControl(emailInputsArray.controls[i]);
        if (i < 10) {
          emailInputsArray.controls[i].patchValue({
            emailName: customerEmails[i].EmailName,
            email: customerEmails[i].Email,
            tempid: customerEmails[i].tempid,
            emailsex: customerEmails[i].EmailSex,
            newslettere: customerEmails[i].Newslettere,
            deleteRow: ''
          })
          emailInputsArray.controls[i].setValidators([Validators.required, Validators.email]);
          emailInputsArray.controls[i].updateValueAndValidity();
          console.log(emailInputsArray.value)
        }
      }
    }
    console.log('PHONES ARRAY FROM EMAIL SERVICE', emailInputsArray);
  }


  addEmail(array: FormArray) {
    if (array.length < 10) {
      array.push(this.fb.group({
        emailName: [''],
        email: ['', [Validators.email, Validators.required]],
        tempid: [''],
        emailsex: [''],
        newslettere: [''],
        deleteRow: ['']
      }))
    }
  }

  deleteEmail(email: Email) {
    email.deleteRow = 1; // Чтобы удалился объект deletRow должно быть равно 1;
    return this.mainInfoService.saveChangedCustomerData({ emails: [email] })
  }

  saveEmailOnServer(email: Email) {
    return this.mainInfoService.saveChangedCustomerData({ emails: [email] });
  }

  disableFormControl(control: AbstractControl) {
    control.disable();
  }

  enableFormControl(control: AbstractControl) {
    control.enable();
  }

  updateCustomerInfo() {
    this.mainInfoService.updateCustomerInfo();
  }

  isEmptyEmailControl(email: Email) {
    return email.email;
  }
}
