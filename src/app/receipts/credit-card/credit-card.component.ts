import { LastSelection } from './../../models/lastSelection.model';
import { CreditCardService } from './credit-card.service';
import { GeneralSrv } from './../../services/GeneralSrv.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { MatDialogRef } from '@angular/material';
import { CreditCardValidator } from 'angular-cc-library';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Creditcard } from 'src/app/models/creditCard.model';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent implements OnInit, OnDestroy {
  @ViewChild('creditCard') creditCardInput: ElementRef;
  @ViewChild('expYear') expYearInput: ElementRef;
  creditCardForm: FormGroup;
  accounts: object[] = [];
  termNo: string;
  termName: string;
  verifyCreditCard: Creditcard;
  _accountId = null;
  acc: object;
  heLang: boolean;
  enLang: boolean;
  currentlyStoreAmount: 0;
  amountError = false;
  subscription = new Subscription();
  useCardReaderControl: FormControl;
  constructor(
    private toastr: ToastrService,
    private receiptService: ReceiptsService,
    private MatdialogRef: MatDialogRef<CreditCardComponent>,
    private fb: FormBuilder,
    private generalService: GeneralSrv,
    private credirCardService: CreditCardService,
    private creditCard: CreditCardService
  ) {
    this.creditCardForm = this.fb.group({
      creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
      customerName: ['', Validators.required],
      // expirationDate: ['', [CreditCardValidator.validateExpDate]],
      expMonth: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.min(1), Validators.max(12)]],
      expYear: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.min(2019)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      tz: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      amount: [null, [Validators.required]],
      numberOfPayments: [1, Validators.required],
      // firstPayment: ['', Validators.required],
      eachPayment: [{ value: null, disabled: true }],
      manualApprNum: [''],
      accountId: [this._accountId, Validators.required],
    });
    console.log('_AccountID', this.accountId.value);
    // this.generalService.currentLastSelect.subscribe((lastSelect: LastSelection) => {
    //   this.creditCardForm.get('accountId').patchValue(lastSelect.creditCardAccId);
    // });
  }
  get accountId() {
    return this.creditCardForm.get('accountId');
  }
  get creditCardNumber() {
    return this.creditCardForm.get('creditCard');
  }
  get expirationDate() {
    return this.creditCardForm.get('expirationDate');
  }
  get expMonth() {
    return this.creditCardForm.get('expMonth');
  }
  get expYear() {
    return this.creditCardForm.get('expYear');
  }
  ngOnInit() {
    this.subscription.add(this.createToggleControl().valueChanges.subscribe((data: boolean) => {
      if (data === true) {
        this.creditCardNumber.patchValue('');
        this.creditCardNumber.clearValidators();
        this.creditCardNumber.updateValueAndValidity();
        this.onFocusCrediCardNumber();
      } else {
        this.creditCardNumber.patchValue('');
        this.creditCardNumber.setValidators(<any>CreditCardValidator.validateCCNumber);
        this.creditCardNumber.updateValueAndValidity();
        this.onFocusCrediCardNumber();
      }
    }));
    this.setFullName(this.receiptService.getFirstLastName());
    this.setTz(this.receiptService.getTz());
    this.subscription.add(this.generalService.currentLang$.subscribe(lang => {
      if (lang === 'he') {
        this.heLang = true;
        this.enLang = false;
      } if (lang === 'en') {
        this.enLang = true;
        this.heLang = false;
      }
    }));
    this.getLastSelection();
    console.log('accountCred', this.accountId.value);
    this.subscription.add(this.generalService.currentReceiptData$.subscribe(data => {
      this.accounts = data['Accounts'];
    }));
    this.subscription.add(this.accountId.valueChanges.subscribe(accountCredId => {
      this._accountId = accountCredId;
      this.pickAccount();
      console.log(accountCredId);
    }));
    this.pickAccount();
    // this.checkFieldsValue();
    this.getCurrentlyAmountFromStore();
    this.detectChangeAmount();
    this.onFocusExpYear();
  }
  onFocusExpYear() {
    this.subscription.add(this.expMonth.valueChanges.subscribe((value: string) => {
      if (value.length === 2) {
        this.expYearInput.nativeElement.focus();
      }
    }));
    this.onBlurExpYear();
  }
  onBlurExpYear() {
    this.subscription.add(this.expYear.valueChanges.subscribe((value: string) => {
      if (value.length === 4) {
        this.expYearInput.nativeElement.blur();
      }
    }));
  }
  calculateAmountPay() {
    console.log(this.creditCardForm.controls.amount)
  }
  closeModal() {
    this.MatdialogRef.close();
  }
  submitCreditCard(form) {
    if (this.accountId.value === null || this.accountId.value === '' || this.accountId.value === undefined) {
      this.toastr.warning('', 'Please select the account', {
        positionClass: 'toast-top-center'
      });
    } else {
      if (this.creditCardForm.controls.numberOfPayments.value >= 0) {
        if (this.creditCardForm.controls.amount.value >= 0) {

          // const expirationDate = `${this.expMonth.value}/${this.expYear.value}`;
          const cvv = form.value.cvv.substring(0, 4);
          let creditCardNumber;
          if (form.value.creditCard.length > 25) {
            creditCardNumber = form.value.creditCard;
          } else {
            creditCardNumber = form.value.creditCard.replace(/\s+/g, '');
          }
          this.verifyCreditCard = {
            accountid: form.value.accountId,
            osumtobill: +this.creditCardForm.controls.amount.value,
            ocardvaliditymonth: this.expMonth.value,
            oCardValidityYear: this.expYear.value.substring(2, 4),
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
          console.log(JSON.stringify(this.verifyCreditCard));
          this.subscription.add(this.generalService.creditCardVerify(this.verifyCreditCard).subscribe(res => {
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
              this.generalService.setItemToLastSelection('creditCardAccId', this.verifyCreditCard.accountid);
              // localStorage.setItem('creditCardAccId', this.verifyCreditCard.accountid.toString());
              this.closeModal();
            }
          }));
          console.log(form.value.cvv);
          this.receiptService.amount.next(this.totalPaymentAmount);
        } else {
          this.toastr.warning('Amount is invalid', '', {
            positionClass: 'toast-top-center'
          });
        }
      } else {
        this.toastr.warning('Number of payments is invalid', '', {
          positionClass: 'toast-top-center'
        });
      }
    }
  }
  getLastSelection() {
    this.generalService.currentLastSelect$.subscribe((lastSelect: LastSelection) => {
      if (lastSelect === null) {
      } else {
        this.accountId.patchValue(lastSelect.creditCardAccId);
        this._accountId = lastSelect.creditCardAccId;
        this.pickAccount();
      }
    });
  }
  pickAccount() {
    for (const acc of this.accounts) {
      if (acc['AccountId'] === this._accountId) {
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
    this.subscription.add(this.receiptService.currentStoreAmount$.subscribe(data => {
      this.currentlyStoreAmount = data;
      if (data !== undefined) {
        this.totalPaymentAmount = data; // Setter total amount in creditCardForm
      } else {
        this.totalPaymentAmount = null;
      }
      this.calculatePaymentsForCredCard();
    }));
  }
  detectChangeAmount() {
    this.subscription.add(this.creditCardForm.get('amount').valueChanges.pipe(debounceTime(500))
      .subscribe(data => {
        if (data < this.currentlyStoreAmount || data === 0) {
          this.amountError = true;
        } else {
          this.amountError = false;
        }
        this.calculatePaymentsForCredCard();
      }));
    this.subscription.add(this.creditCardForm.get('numberOfPayments').valueChanges.pipe(debounceTime(500))
      .subscribe(() => {
        this.calculatePaymentsForCredCard();
      }));
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
        this.toastr.warning('Data is invalid', '', {
          positionClass: 'toast-top-center'
        });
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
  refreshCreditCardForm() {
    this.creditCardForm.reset();
  }
  setFullName(value) {
    this.creditCardForm.get('customerName').patchValue(value);
  }
  setTz(value) {
    this.creditCardForm.get('tz').patchValue(value);
  }
  // tslint:disable-next-line: use-life-cycle-interface

  createToggleControl() {
    return this.useCardReaderControl = this.fb.control(false);
  }
  getAccountNameAndNumber() {

  }
  useCardReader() {
    const cardCode = '4580090107623093=24012010000016411000';
    if (this.useCardReaderControl.value === true) {
      if (this.accountId.value === null) {
        this.toastr.warning('', 'Please select the account', {
          positionClass: 'toast-top-center'
        });
      } else if (cardCode.length > 17) {
        // tslint:disable-next-line: max-line-length
        this.credirCardService.getCreditCardInfoWithCardreader(this.termNo, cardCode, this.termName).subscribe(response => {
          const token = response.substr(response.indexOf('Token') + 6, 36);
          const expDate = response.substr(response.indexOf('Tokef_30') + 9, 4);
          this.creditCardNumber.patchValue(token);
          this.expMonth.patchValue(expDate.substr(0, 2));
          this.expYear.patchValue(`20${expDate.substr(2, 3)}`);
          // this.expirationDate.patchValue(expDate);
          console.log(expDate);
          console.log(response);
        });
      }
    } else {
      this.toastr.warning('', 'Card reader required', {
        positionClass: 'toast-top-center'
      });
    }
  }
  onFocusCrediCardNumber() {
    this.creditCardInput.nativeElement.focus();
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    console.log('CREDIT CARD SUBSCRIBE', this.subscription);
    this.subscription.unsubscribe();
    console.log('CREDIT CARD DESTROED', this.subscription);
  }
}


