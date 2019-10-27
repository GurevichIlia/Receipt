import { EmailsService, Email } from './emails.service';
import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FullCustomerDetailsById, CustomerEmails } from 'src/app/models/fullCustomerDetailsById.model';
import { Response } from 'src/app/models/response.model';

@Component({
  selector: 'app-emails-info',
  templateUrl: './emails-info.component.html',
  styleUrls: ['./emails-info.component.css'],
})
export class EmailsInfoComponent implements OnInit, OnDestroy {
  @Input() mainInfoForm: FormGroup;
  customerEmails: CustomerEmails[];
  subscription$ = new Subject();

  constructor(private emailService: EmailsService) { }

  ngOnInit() {
    this.getCustomerEmails();
  }

  get emails() {
    return this.mainInfoForm.get('emails') as FormArray;
  }

  getCustomerEmails() {
    this.emailService.getCustomerDetailsByIdState$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((customerDetails: FullCustomerDetailsById) => {
        console.log('GOT CUSTOMER DETAILS', customerDetails);
        if (customerDetails) {
          this.customerEmails = customerDetails.CustomerEmails;

          this.createEmailInputsArray(this.emails, this.customerEmails);
        }
      });
  }

  createEmailInputsArray(emailInputsArray: FormArray, customerEmails: CustomerEmails[]) {
    this.emailService.createEmailInputsArray(emailInputsArray, customerEmails);
  }

  getAction(event: { action: string, index?: number }) {
    switch (event.action) {
      case 'addNewEmail': this.addEmailInput(this.emails, event.index);
        break
      case 'deleteEmail': this.deleteEmail(this.emails, event.index);
        break
      case 'saveEmail': this.saveEmail(this.emails, event.index);
        break
      case 'editEmail': this.editEmail(this.emails, event.index);
        break
    }

  }

  editEmail(array: FormArray, i) {
    this.emailService.enableFormControl(array.controls[i]);
  }

  saveEmail(array: FormArray, i) {
    const email: Email = array.controls[i].value;
    if (email.email !== '') {
      this.emailService.saveEmailOnServer(email)
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
      alert('Please enter correct email');
      array.removeAt(i);
    }


  }

  addEmailInput(array: FormArray, i) {
    this.emailService.addEmail(array);
  }

  deleteEmail(array: FormArray, i) {
    const email: Email = array.controls[i].value;
    if (array.length === 1) {
      return;
    } else if (confirm('Would you like to delete this field?')) {
      this.emailService.deleteEmail(email)
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.createAction({ action: 'saveEmail', subject: this.emails});
    this.subscription$.next();
    this.subscription$.complete();
  }
}