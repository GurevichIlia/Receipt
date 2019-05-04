import { GeneralSrv } from './../../services/GeneralSrv.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { MatDialogRef } from '@angular/material';
import { CreditCardValidator } from 'angular-cc-library';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent implements OnInit {
  // @ViewChild('Account') selAccount: object = {};
  creditCardForm: FormGroup;
  accounts: object[] = [];
  termNo: string;
  termName: string;
  constructor(
    private receitService: ReceiptsService,
    private MatdialogRef: MatDialogRef<CreditCardComponent>,
    private fb: FormBuilder,
    private generalService: GeneralSrv
  ) {
    this.creditCardForm = this.fb.group({
      creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
      expirationDate: ['', [CreditCardValidator.validateExpDate]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      tz: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      totalPayments: ['', [Validators.required]],
      amountOfFirstPay: ['', [Validators.required]],
      amountOfEachPay: ['', [Validators.required]],
      manualApprNum: ['', [Validators.required]],
      account: [null],
    });
  }

  ngOnInit() {
    this.generalService.receiptData.subscribe(data => {
      this.accounts = data['Accounts'];
    });
    this.creditCardForm.controls.amount.valueChanges.subscribe(data => {
      console.log(data);
      this.creditCardForm.controls.amountOfEachPay.setValue(data / 3)
    }
    )
  }
  calculateAmountPay() {
    console.log(this.creditCardForm.controls.amount)

  }
  closeModal() {
    this.MatdialogRef.close();
  }
  submitCreditCard(form) {
    console.log(form)
  }
  pickAccount(account: object) {
    this.creditCardForm.controls.account.setValue(account['value'].AccountId);
    this.termNo = account['value'].ASHRAY;
    this.termName = account['value'].Username;
    console.log(this.termNo, this.termName, account);
  }
}
