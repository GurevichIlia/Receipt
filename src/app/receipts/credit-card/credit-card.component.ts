import { Creditcard } from './../../models/creditCard.model';
import { CreditCardService } from './credit-card.service';
import { CreditCardVerify } from './../../models/credirCardVerify.model';
import { GeneralSrv } from './../../services/GeneralSrv.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { MatDialogRef } from '@angular/material';
import { CreditCardValidator } from 'angular-cc-library';
import { ToastrService } from 'ngx-toastr';



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
  verifyCreditCard: Creditcard;
  accountId: number;
  acc: object;
  constructor(
    private toastr: ToastrService,
    private receitService: ReceiptsService,
    private MatdialogRef: MatDialogRef<CreditCardComponent>,
    private fb: FormBuilder,
    private generalService: GeneralSrv,
    private credirCardService: CreditCardService
  ) {
    this.accountId = Number(localStorage.getItem('creditCardAccId'));
    this.creditCardForm = this.fb.group({
      creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
      customerName: ['', Validators.required],
      expirationDate: ['', [CreditCardValidator.validateExpDate]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      tz: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      // amount: ['', [Validators.required]],
      // totalPayments: ['', [Validators.required]],
      // amountOfFirstPay: ['', ],
      // amountOfEachPay: ['', ],
      manualApprNum: [''],
      accountId: [this.accountId, Validators.required],
    });
  }

  ngOnInit() {
    console.log('accountCred', this.creditCardForm.get('accountId'));
    this.generalService.receiptData.subscribe(data => {
      this.accounts = data['Accounts'];
    });
    this.creditCardForm.controls.accountId.valueChanges.subscribe(accountCred => {
      this.accountId = accountCred.AccountId;
      this.pickAccount();
      console.log(accountCred);
    });
    this.pickAccount();
  }

  calculateAmountPay() {
    console.log(this.creditCardForm.controls.amount)

  }
  closeModal() {
    this.MatdialogRef.close();
  }
  submitCreditCard(form) {
    console.log(form)
    const expirationDate = form.value.expirationDate.substring(0, 9);
    const cvv = form.value.cvv.substring(0, 4);
    const creditCardNumber = form.value.creditCard.replace(/\s+/g, '');
    this.verifyCreditCard = {
      accountid: form.value.accountId,
      osumtobill: 1,
      ocardvaliditymonth: expirationDate.substring(0, 2),
      oCardValidityYear: expirationDate.substring(5, 9),
      ocardnumber: creditCardNumber,
      ocardownerid: form.value.tz,
      cvv: cvv,
      customername: form.value.customerName,
      ouserpassword: '',
      oapprovalnumber: form.value.manualApprNum,
      thecurrency: 'NIS',
      oNumOfPayments: null,
      ofirstpaymentsum: null
    };

    console.log(this.verifyCreditCard);
    this.generalService.creditCardVerify(this.verifyCreditCard).subscribe(res => {
      console.log(res)
      if (res['IsError'] === true) {
        this.toastr.error('Credit card not verified', res['ErrMsg'], {
          positionClass: 'toast-top-center'
        });
      } else {
        this.credirCardService.verifiedCreditCardDetails = this.verifyCreditCard;
        this.credirCardService.credCardIsVerified.next(true);
        const data = res['Data'];
        console.log('Credit card verified', data)
        this.toastr.success('Credit card verified', '', {
          positionClass: 'toast-top-center'
        });
        localStorage.setItem('creditCardAccId', this.verifyCreditCard.accountid.toString());
        this.closeModal();
      }
    });
    console.log(form.value.cvv);
  }
  pickAccount() {
    for (let acc of this.accounts) {
      if (acc['AccountId'] === this.accountId) {
        this.termNo = acc['ASHRAY'];
        this.termName = acc['Username'];
      }
    }
  }
}
