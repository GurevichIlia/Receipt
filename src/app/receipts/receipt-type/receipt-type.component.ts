import { ServerErrorInterceptor } from './../../services/server-error-interceptor.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { MatRadioChange, MatDialog } from '@angular/material';
import { CreditCardComponent } from '../credit-card/credit-card.component';
import { CreditCardService } from '../credit-card/credit-card.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { ReceiptType } from 'src/app/models/receiptType.interface';

@Component({
  selector: 'app-receipt-type',
  templateUrl: './receipt-type.component.html',
  styleUrls: ['./receipt-type.component.css']
})
export class ReceiptTypeComponent implements OnInit {
  @Output() changeValue: EventEmitter<MatRadioChange>;
  step: number;
  receiptTypes: ReceiptType[] = [];
  newReceiptTypes: any[];
  organisations: any[] = [];
  paymentMethods: object[] = [];
  receiptType: FormControl;
  selected_receiptIsForDonation = true;
  selected_receiptCreditOrDebit = false;
  selectedOrg = 1;
  selectedReceiptType: ReceiptType; // Получаем полный объект выбранного receipt в зависимости от id из массива receiptTypes.
  selectedReceiptTypeId = null;
  receiptCurrencyId: string;
  paymentMethodId = null;
  isVerified = false;
  creditCardPassword: FormControl;
  disabledPayMethod = false;
  nextStepDisabled = true;
  currentlyLang: string;
  receiptTypeGroup: FormGroup;
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private creditCardService: CreditCardService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private errorInterceptor: ServerErrorInterceptor
  ) {
    // this.creditCardPassword = this.fb.control('', Validators.required);
    // this.selectedReceiptTypeId = Number(localStorage.getItem('receipt-type'));

  }
  ngOnInit() {
    this.receiptTypeGroup = this.fb.group({
      paymentMethodId: ['', Validators.required],
      receiptTypeId: ['', Validators.required],
      selected_receiptIsForDonation: [true],
      selected_receiptCreditOrDebit: [false],
      creditCardPassword: [''],
      selectedOrg: [1]
    });
    this.receiptTypeGroup.patchValue({
      paymentMethodId: localStorage.getItem('paymenthMethod') ? +localStorage.getItem('paymenthMethod') : '',
      receiptTypeId: localStorage.getItem('receipt-type') ? +localStorage.getItem('receipt-type') : '',
      selected_receiptIsForDonation: localStorage.getItem('selected_receiptIsForDonation') == 'true' ? true : false,
      selectedOrg: localStorage.getItem('selectedOrg') ? +localStorage.getItem('selectedOrg') : 1,
    });
    this.paymentMethodId = this.receiptTypeGroup.get('paymentMethodId').value;
    this.getReceiptsData();
    this.disabledNextStep();
    this.getPaymentTypes();
    // tslint:disable-next-line: max-line-length
    this.generalService.currentlyLang.subscribe(data => this.currentlyLang = data);
    // this.receiptType = new FormControl('0');


    this.receiptTypeGroup.valueChanges.subscribe(() => this.disabledNextStep());
    // this.receiptService.currentlyStep.subscribe(step => {
    //   this.step = step;
    //   console.log('STEP receipt type', this.step);
    // });
    this.receiptService.currentlyStep.subscribe(step => this.step = step);

    // this.receiptService.selectedPaymentMethod.subscribe(data => {
    //   this.paymentMethodId = data;
    //   this.payMath = new FormControl({ value: this.paymentMethodId, disabled: this.disabledPayMethod }, [Validators.required]);
    // });
    console.log('this.paymentMethodId', this.paymentMethodId);

    this.creditCardService.currentlyCreditCardVarified.subscribe((isVerified: boolean) => {
      this.isVerified = isVerified;
      this.disabledNextStep();
    });
    this.receiptService.blockPayMethod.subscribe((data: boolean) => {
      this.disabledPayMethod = data;
      console.log(this.disabledPayMethod);
    });
  }
  setSelectedReceiptType(fullReceipType: ReceiptType) {
    this.selectedReceiptType = fullReceipType;
    console.log(this.selectedReceiptType);
  }
  getPaymentTypes() {
    this.generalService.receiptData.subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
    });
  }
  checkPayType(payType: number) {
    // this.disabledNextStep();
    const paymentMethod = this.receiptTypeGroup.get('paymentMethodId');
    paymentMethod.patchValue(payType);
    this.receiptService.paymentMethod.next(payType);
    if (payType === 3) {
      this.receiptService.payByCreditCard.next(true);
    } else {
      this.receiptService.payByCreditCard.next(false);
    }
    this.disabledNextStep();
  }
  getReceiptsData() {
    this.generalService.getReceiptshData().subscribe(data => {
      console.log('Receipt Data', data);
      this.generalService.fullReceiptData.next(data);
      this.receiptTypes = data.ReceiptTypes as ReceiptType[];
      this.organisations = data.Orgs;
      this.filterRecType();
    },
      error => console.log(error)
      //  {
      //   if (error.statusText === 'Invalid token') {
      //     this.authService.logout();
      //     this.router.navigate(['login']);
      //   }
      // }
    );
  }
  /**
    * Filter for receipt-types, depends on the options selected.
    */
  filterRecType() {
    const selected_receiptIsForDonation = this.receiptTypeGroup.get('selected_receiptIsForDonation').value;
    const selected_receiptCreditOrDebit = this.receiptTypeGroup.get('selected_receiptCreditOrDebit').value;
    const selectedOrg = this.receiptTypeGroup.get('selectedOrg').value;
    try {
      this.newReceiptTypes = Object.assign(
        [],
        this.receiptTypes
      );
      this.newReceiptTypes = this.newReceiptTypes.filter(
        e =>
          e.DonationReceipt === selected_receiptIsForDonation &&
          e.UseAsCreditReceipt === selected_receiptCreditOrDebit &&
          e.orgid === selectedOrg
      );
      // this.receiptType = this.receiptTypes[0].RecieptTypeId;
      this.selectedReceiptType = null;
      console.log('selectRecType', this.newReceiptTypes)
    } catch (e) {
      console.log(e);
    }
  }
  radButChanged() {
    this.filterRecType();
  }
  showRecieptTypeId() {
    this.receiptService.selectedReceiptType = this.selectedReceiptType;
    this.disabledNextStep();
    console.log(this.selectedReceiptType);
  }
  addPaymentTypeToReceipt() {
    const selectedReceiptTypeId = this.receiptTypeGroup.get('receiptTypeId').value;
    const selectedOrg = this.receiptTypeGroup.get('selectedOrg').value;
    const selected_receiptIsForDonation = this.receiptTypeGroup.get('selected_receiptIsForDonation').value;
    const paymentMethodId = this.receiptTypeGroup.get('paymentMethodId').value;
    const selected_receiptCreditOrDebit = this.receiptTypeGroup.get('selected_receiptCreditOrDebit').value;
    for (const receiptType of this.receiptTypes) {
      if (receiptType.RecieptTypeId === selectedReceiptTypeId) {
        this.selectedReceiptType = receiptType;
      }
    }
    this.receiptService.newReceipt.Receipt.ReceiptHeader.RecieptType = selectedReceiptTypeId;
    this.receiptService.newReceipt.Receipt.ReceiptHeader.CurrencyId = this.selectedReceiptType.CurrencyId;
    if (selected_receiptCreditOrDebit === false) {
      localStorage.setItem('receipt-type', selectedReceiptTypeId);
      localStorage.setItem('selectedOrg', selectedOrg);
      localStorage.setItem('selected_receiptIsForDonation', selected_receiptIsForDonation);

    } else {
      localStorage.removeItem('receipt-type');
      localStorage.removeItem('selectedOrg');
      localStorage.removeItem('selected_receiptIsForDonation');
    }
    this.receiptService.setSelectedReceiptType(this.selectedReceiptType);
    this.receiptService.selReceiptCurrencyId.next(this.selectedReceiptType.CurrencyId);
    this.receiptService.newReceipt.PaymentType = paymentMethodId;
    if (paymentMethodId === 3) {
      if (selected_receiptCreditOrDebit === true) {
        this.receiptService.newReceipt.creditCard.ouserpassword = this.creditCardPassword.value;
       } 
    }
    this.receiptService.paymentMethod.next(paymentMethodId);
    localStorage.setItem('paymenthMethod', paymentMethodId);

    // this.receiptService.newReceipt.receiptType = this.selectOptForReceiptType;
    this.receiptService.checkSelectedRecType.next();
    console.log(this.receiptTypeGroup.value);
    console.log(this.receiptService.newReceipt);
    this.receiptService.nextStep();
  }
  creditCardModalOpen(paymentMethodId: number) {
    // console.log(this.isVerified);
    // console.log(this.selectedPayMethod);
    this.checkPayType(paymentMethodId);
    this.paymentMethodId = paymentMethodId;
    if (paymentMethodId === undefined) {
      this.paymentMethodId = +localStorage.getItem('paymenthMethod');
    }
    if (this.paymentMethodId === 3) {
      this.dialog.open(CreditCardComponent, { width: '350px' });
      console.log(this.paymentMethodId);
    } else {
      return;
    }
    this.disabledNextStep();
  }
  disabledNextStep() {
    const payTypeId = this.receiptTypeGroup.get('paymentMethodId').value;
    const receiptTypeId = this.receiptTypeGroup.get('receiptTypeId').value;
    if (receiptTypeId == '') {
      this.nextStepDisabled = true;
    } else if (payTypeId === 3) {
      if (this.isVerified === true) {
        this.nextStepDisabled = false;
      } else {
        this.nextStepDisabled = true;
      }
    } else {
      this.nextStepDisabled = false;
    }
    // if (this.selected_receiptCreditOrDebit === false) {
    //   this.creditCardPassword.clearValidators();
    // } else {
    //   this.creditCardPassword.setValidators(Validators.required);
    // }
    //   if (this.selectedReceiptType === null || this.paymentMethodId === null) {
    //     this.nextStepDisabled = true;
    //   } else if (this.paymentMethodId === 3) {
    //     if (this.paymentMethodId === 3 && this.isVerified === true) {
    //       debugger
    //       if (this.creditCardPassword.value === '' && this.selected_receiptCreditOrDebit === true) {
    //         this.nextStepDisabled = true;
    //       } else {
    //         this.nextStepDisabled = false;
    //       }
    //     } else if (this.paymentMethodId === 3 && this.isVerified === false) {
    //       this.nextStepDisabled = true;
    //     } else {
    //       this.nextStepDisabled = false;
    //     }
    //   } else {
    //     this.nextStepDisabled = false;
    //   }
    // }
    console.log(receiptTypeId)
  }
}
