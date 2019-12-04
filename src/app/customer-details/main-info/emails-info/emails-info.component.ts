import { EmailsService, Email } from './emails.service';
import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
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
  loading = true;
  newEvent: { action: string, index?: number };
  constructor(private emailService: EmailsService) { }

  ngOnInit() {
    this.getCustomerEmails();
    this.mainInfoForm.get('emails').statusChanges
      .pipe(distinctUntilChanged())
      .subscribe(emails => {
        this.mainInfoForm.get('emails').updateValueAndValidity()
          console.log('EMAILS', emails);

      })
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
          this.loading = false;

        }
      });
  }

  createEmailInputsArray(emailInputsArray: FormArray, customerEmails: CustomerEmails[]) {
    this.emailService.createEmailInputsArray(emailInputsArray, customerEmails);
  }

  getAction(event: { action: string, index?: number }) {
    switch (event.action) {
      case 'addNewEmail': this.addEmailInput(this.emails);
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
    debugger
    if (array.controls[i].valid) {
      this.loading = true;
      this.emailService.saveEmailOnServer(email)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: Response) => {
          if (response.Data.error === 'false') {
            this.disableFormControl(array.controls[i]);
            this.loading = false;
            this.emailService.updateCustomerInfo();
            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          } else if (response.Data.error === 'true') {
            console.log('RESPONSE ERROR', response.Data.res_description);
            console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
          }
        },
          error => console.log(error));

    } else {
      alert('Please enter correct email');
    }


  }

  addEmailInput(array: FormArray) {
    this.emailService.addEmail(array);
  }

  deleteEmail(array: FormArray, i) {
    const email: Email = array.controls[i].value;
    if (!email.tempid) {
      array.removeAt(i);
    } else if (array.length === 1) {
      return;
    } else if (confirm('Would you like to delete this field?')) {
      this.loading = true;
      this.emailService.deleteEmail(email)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: Response) => {
          if (response.Data.error === 'false') {
            array.removeAt(i);
            this.loading = false;
            this.emailService.updateCustomerInfo();
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