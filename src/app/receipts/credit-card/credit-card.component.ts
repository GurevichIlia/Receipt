import { CreditCardService } from './credit-card.service';
import { CreditCardVerify } from './../../models/credirCardVerify.model';
import { GeneralSrv } from './../../services/GeneralSrv.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { MatDialogRef } from '@angular/material';
import { CreditCardValidator } from 'angular-cc-library';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Creditcard } from 'src/app/models/creditCard.model';



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
  heLang: boolean;
  enLang: boolean;
  currentlyStoreAmount: 0;
  amountError = false;
  constructor(
    private toastr: ToastrService,
    private receiptService: ReceiptsService,
    private MatdialogRef: MatDialogRef<CreditCardComponent>,
    private fb: FormBuilder,
    private generalService: GeneralSrv,
    private credirCardService: CreditCardService,
    private creditCard: CreditCardService
  ) {
    this.accountId = +localStorage.getItem('creditCardAccId');
    this.creditCardForm = this.fb.group({
      creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
      customerName: ['', Validators.required],
      expirationDate: ['', [CreditCardValidator.validateExpDate]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      tz: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      amount: [null, [Validators.required]],
      numberOfPayments: [1, Validators.required],
      // firstPayment: ['', Validators.required],
      eachPayment: [{ value: null, disabled: true }],
      manualApprNum: [''],
      accountId: [this.accountId, Validators.required],
    });
    console.log('AccountID', this.creditCardForm.get('accountId'));
  }
  ngOnInit() {
    this.generalService.currentlyLang.subscribe(lang => {
      if (lang === 'he') {
        this.heLang = true;
        this.enLang = false;
      } if (lang === 'en') {
        this.enLang = true;
        this.heLang = false;
      }
    })
    console.log('accountCred', this.creditCardForm.get('accountId'));
    this.generalService.receiptData.subscribe(data => {
      this.accounts = data['Accounts'];
    });
    this.creditCardForm.controls.accountId.valueChanges.subscribe(accountCredId => {
      this.accountId = accountCredId;
      this.pickAccount();
      console.log(accountCredId);
    });
    this.pickAccount();
    // this.checkFieldsValue();
    this.getCurrentlyAmountFromStore();
    this.detectChangeAmount();
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
      osumtobill: Number(this.creditCardForm.controls.amount.value),
      ocardvaliditymonth: expirationDate.substring(0, 2),
      oCardValidityYear: expirationDate.substring(5, 9),
      ocardnumber: creditCardNumber,
      ocardownerid: form.value.tz,
      cvv: cvv,
      customername: form.value.customerName,
      ouserpassword: '',
      oapprovalnumber: form.value.manualApprNum,
      thecurrency: 'NIS',
      oNumOfPayments: this.creditCardForm.controls.numberOfPayments.value,
      ofirstpaymentsum: ''
    };

    console.log(this.verifyCreditCard);
    this.generalService.creditCardVerify(this.verifyCreditCard).subscribe(res => {
      console.log(res);
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
    debugger;
    console.log(form.value.cvv);
    this.receiptService.amount.next(this.totalPaymentAmount);
  }
  pickAccount() {
    for (const acc of this.accounts) {
      if (acc['AccountId'] === this.accountId) {
        this.termNo = acc['ASHRAY'];
        this.termName = acc['Username'];
      }
    }
  }
  // checkFieldsValue() {
  //   this.receiptService.currentlyStoreAmount.subscribe(data => {
  //     this.totalPaymentAmount = data; // Setter
  //   });
  //   const totalAmount = this.creditCardForm.get('amount');
  //   const firstPayment = this.creditCardForm.get('firstPayment');
  //   const numberOfPayments = this.creditCardForm.get('numberOfPayments');
  //   totalAmount.valueChanges.pipe(debounceTime(500))
  //     .subscribe(total => {
  //       if (numberOfPayments.value === 1) {
  //         this.creditCardForm.controls.firstPayment.patchValue(null);
  //         this.creditCardForm.controls.eachPayment.patchValue(null);
  //         firstPayment.clearValidators();
  //       } else {
  //         firstPayment.setValidators([Validators.required]);
  //         if (firstPayment.status === 'INVALID' || totalAmount.status === 'INVALID' || numberOfPayments.status === 'INVALID') {
  //           this.creditCardForm.controls.eachPayment.patchValue(null);
  //         } else {
  //           this.calculatePaymentsForCredCard();
  //         }
  //       }
  //     });
  //   firstPayment.valueChanges.pipe(
  //     debounceTime(500))
  //     .subscribe(firstPay => {
  //       if (numberOfPayments.value === 1) {
  //         this.creditCardForm.controls.firstPayment.patchValue(null);
  //         this.creditCardForm.controls.eachPayment.patchValue(null);
  //         firstPayment.clearValidators();
  //       } else {
  //         firstPayment.setValidators([Validators.required]);
  //         if (firstPayment.status === 'INVALID' || totalAmount.status === 'INVALID' || numberOfPayments.status === 'INVALID') {
  //           this.creditCardForm.controls.eachPayment.patchValue(null);
  //         } else {
  //           this.calculatePaymentsForCredCard();
  //         }
  //       }
  //     });
  //   numberOfPayments.valueChanges.pipe(
  //     debounceTime(500))
  //     .subscribe(totalPay => {
  //       debugger
  //       if (numberOfPayments.value === 1) {
  //         this.creditCardForm.controls.firstPayment.patchValue(null);
  //         this.creditCardForm.controls.eachPayment.patchValue(null);
  //         firstPayment.clearValidators();
  //       } else {
  //         firstPayment.setValidators([Validators.required]);
  //         if (firstPayment.status === 'INVALID' || totalAmount.status === 'INVALID' || numberOfPayments.status === 'INVALID') {
  //           this.creditCardForm.controls.eachPayment.patchValue(null);
  //         } else {
  //           this.calculatePaymentsForCredCard();
  //         }
  //       }
  //     });
  // }


  getCurrentlyAmountFromStore() {
    this.receiptService.currentlyStoreAmount.subscribe(data => {
      this.currentlyStoreAmount = data;
      if (data !== undefined) {
        this.totalPaymentAmount = data; // Setter total amount in creditCardForm
      } else {
        this.totalPaymentAmount = null;
      }
      this.calculatePaymentsForCredCard();
    });
  }
  detectChangeAmount() {
    this.creditCardForm.get('amount').valueChanges.pipe(debounceTime(500))
      .subscribe(data => {
        debugger
        if (data < this.currentlyStoreAmount || data === 0) {
          this.amountError = true;
        } else {
          this.amountError = false;
        }
        this.calculatePaymentsForCredCard();
      });
    this.creditCardForm.get('numberOfPayments').valueChanges.pipe(debounceTime(500))
      .subscribe(() => {
        this.calculatePaymentsForCredCard();
      });
  }
  calculatePaymentsForCredCard() {
    const totalAmount: number = this.creditCardForm.get('amount').value;
    const numberOfPayments: number = this.creditCardForm.get('numberOfPayments').value;
    // const firstPayment = this.creditCardForm.get('firstPayment').value;
    if (totalAmount !== null && numberOfPayments !== null) {
      const eachPayment = totalAmount / numberOfPayments;
      console.log('EACHPAY', eachPayment);

      if (eachPayment >= 0) {
        this.creditCardForm.controls.eachPayment.patchValue(Number(eachPayment).toFixed(2));
      } else {
        alert('Add correct data');
      }
    } else {
      this.creditCardForm.controls.eachPayment.patchValue(null);
    }

  }
  get totalPaymentAmount() {
    return this.creditCardForm.controls.amount.value;
  }
  set totalPaymentAmount(value: number) {
    this.creditCardForm.get('amount').patchValue(value);
  }
}