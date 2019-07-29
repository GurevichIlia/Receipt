import { PaymentsService } from '../../payments.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.css']
})
export class NewPaymentComponent implements OnInit {
  step = 0;
  newPaymentForm: FormGroup;
  globalData$
  constructor(
    private _formBuilder: FormBuilder,
    private paymentsService: PaymentsService
  ) { }

  ngOnInit() {
    this.createNewPaymentForm();
    this.getGlobalData();
    this.newPaymentForm.valueChanges.subscribe(data => console.log(data));
    console.log('Proj cat', this.projectCat)
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  createNewPaymentForm() {
    this.newPaymentForm = this._formBuilder.group({
      firstStep: this._formBuilder.group({
        type: ['', Validators.required],
        status: ['', Validators.required],
        groups: ['', Validators.required],
      }),
      secondStep: this._formBuilder.group({
        fileAs: ['', Validators.required],
        Tz: ['', Validators.required],
        tel1: ['', Validators.required],
        tel2: ['', Validators.required],
        remark: ['']
      }),
      thirdStep: this._formBuilder.group({
        bank: this._formBuilder.group({
          codeBank: [''],
          snif: [''],
          accNumber: ['']
        }),
        creditCard: this._formBuilder.group({
          credCard: ['']
        })
      }),
      fourthStep: this._formBuilder.group({
        amount: [''],
        currency: [''],
        day: [''],
        company: [''],
        startDate: [''],
        date1: [''],
        date2: [''],
        date3: [''],
        monthToCharge: [''],
        chargeMonth: [''],
        letToCharge: [''],
        tadirut: ['']
      }),
      fifthStep: this._formBuilder.group({
        receipt: [''],// receipt ForCanclation: false
        receipt2: [''],// receipt ForCanclation: true
        goal: [''],
        account: [''],
        projCat: [''],
        project: [''],
        input1: [''],
        input2: [''],
        fileAs: [''],
        address: [''],
        field: [''],
        checkbox: ['']
      })
    })
  }
  get projectCat() {
    return this.newPaymentForm.get('fifthStep.projCat');
  }
  get paymentType() {
    return this.newPaymentForm.get('firstStep.type')
  }
  getGlobalData() {
    this.globalData$ = this.paymentsService.currentGlobalData$

  }
}
