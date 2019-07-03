import { LastSelection } from './../../models/lastSelection.model';
import { ToastrService } from 'ngx-toastr';
import { ServerErrorInterceptor } from './../../services/server-error-interceptor.service';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, DoCheck } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { MatRadioChange, MatDialog } from '@angular/material';
import { CreditCardComponent } from '../credit-card/credit-card.component';
import { CreditCardService } from '../credit-card/credit-card.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { ReceiptType } from 'src/app/models/receiptType.interface';
import { Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-receipt-type',
  templateUrl: './receipt-type.component.html',
  styleUrls: ['./receipt-type.component.css']
})
export class ReceiptTypeComponent implements OnInit, OnDestroy, DoCheck {
  @Output() changeValue: EventEmitter<MatRadioChange>;
  step: number;
  receiptTypes: ReceiptType[] = [];
  newReceiptTypes: any[];
  organisations: any[] = [];
  paymentMethods: object[] = [];
  receiptTypeId: number = null;
  // selected_receiptIsForDonation = true;
  // selected_receiptCreditOrDebit = false;
  // selectedOrg = 1;
  selectedReceiptType: ReceiptType; // Получаем полный объект выбранного receipt в зависимости от id из массива receiptTypes.
  selectedReceiptTypeId = null;
  receiptCurrencyId: string;
  _paymentMethodId = null;
  isVerified = false;
  disabledPayMethod = false;
  nextStepDisabled = true;
  currentLang: string;
  receiptTypeGroup: FormGroup;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private creditCardService: CreditCardService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toaster: ToastrService
  ) {
    // this.creditCardPassword = this.fb.control('', Validators.required);
    // this.selectedReceiptTypeId = Number(localStorage.getItem('receipt-type'));

  }
  ngOnInit() {
    this.createReceiptTypeGroup();
    this._paymentMethodId = this.receiptTypeGroup.get('paymentMethodId').value;
    this.getReceiptsData();
    this.getPaymentTypes();
    // tslint:disable-next-line: max-line-length
    this.subscriptions.add(this.generalService.currentLang$.subscribe(data => this.currentLang = data));

    this.receiptTypeGroup.valueChanges.subscribe(() => {
      console.log('FORM', this.receiptTypeGroup);
    });
    this.subscriptions.add(this.receiptService.currentStep$.subscribe(step => this.step = step));


    this.subscriptions.add(this.creditCardService.currentCreditCardIsVerified$.subscribe((isVerified: boolean) => {
      this.isVerified = isVerified;

    }));
    this.subscriptions.add(this.receiptService.blockPayMethod$.subscribe((data: boolean) => {
      this.disabledPayMethod = data;
      console.log(this.disabledPayMethod);
    }));
  }
  get receiptCreditOrDebit() {
    const selected_receiptCreditOrDebit = this.receiptTypeGroup.get('selected_receiptCreditOrDebit').value;
    return selected_receiptCreditOrDebit;
  }
  get paymentMethodId() {
    const paymentMethodId = this.receiptTypeGroup.get('paymentMethodId').value;
    return paymentMethodId;
  }
  get receiptType() {
    return this.receiptTypeGroup.get('receiptTypeId');
  }
  get selectedOrg() {
    return this.receiptTypeGroup.get('selectedOrg');
  }
  get selected_receiptIsForDonation() {
    return this.receiptTypeGroup.get('selected_receiptIsForDonation');
  }
  get creditCardPassword() {
    return this.receiptTypeGroup.get('creditCardPassword');
  }

  setPaymentMethodId(paymentMethodId: number) {
    this.receiptTypeGroup.get('paymentMethodId').patchValue(paymentMethodId);
  }
  setReceiptType(receiptType: number) {
    this.receiptTypeGroup.get('receiptTypeId').patchValue(receiptType);
  }
  setSelectedOrg(selectedOrg: number) {
    this.receiptTypeGroup.get('selectedOrg').patchValue(selectedOrg);
  }
  setSelected_receiptIsForDonation(selected_receiptIsForDonation: boolean) {
    this.receiptTypeGroup.get('selected_receiptIsForDonation').patchValue(selected_receiptIsForDonation);
  }
  selected_receiptCreditOrDebit(selected_receiptCreditOrDebit: boolean) {
    this.receiptTypeGroup.get('selected_receiptCreditOrDebit').patchValue(selected_receiptCreditOrDebit);
  }
  ngDoCheck() {
    this.setValidatorToCreditPassword();
    this.disabledNextStep();
  }
  setSelectedReceiptType(fullReceipType: ReceiptType) {
    this.selectedReceiptType = fullReceipType;
    console.log(this.selectedReceiptType);
  }
  getPaymentTypes() {
    this.subscriptions.add(this.generalService.currentReceiptData$.subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
    }));
  }
  checkPayType(payType: number) {
    //
    const paymentMethod = this.receiptTypeGroup.get('paymentMethodId');
    paymentMethod.patchValue(payType);
    this.receiptService.paymentMethod.next(payType);
    if (payType === 3) {
      this.receiptService.payByCreditCard.next(true);
    } else {
      this.receiptService.payByCreditCard.next(false);
    }
  }
  getReceiptsData() {
    this.subscriptions.add(this.generalService.getReceiptshData().subscribe(data => {
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
    ));
  }

  createReceiptTypeGroup() {
    this.receiptTypeGroup = this.fb.group({
      paymentMethodId: [{value: '', disabled: this.disabledPayMethod}],
      receiptTypeId: [''],
      selected_receiptIsForDonation: [true],
      selected_receiptCreditOrDebit: [false],
      creditCardPassword: [''],
      selectedOrg: [1]
    });
    this.checkLastSelection();
  }
  /**
  * Filter for receipt-types, depends on the options selected.
  */
  filterRecType() {
    const selected_receiptIsForDonation = this.receiptTypeGroup.get('selected_receiptIsForDonation').value;
    const selected_receiptCreditOrDebit = this.receiptTypeGroup.get('selected_receiptCreditOrDebit').value;
    const receiptTypeId = this.receiptTypeGroup.get('receiptTypeId');
    const selectedOrg = this.receiptTypeGroup.get('selectedOrg').value;
    try {
      this.newReceiptTypes = Object.assign(
        [],
        this.receiptTypes
      );
      this.newReceiptTypes = this.newReceiptTypes.filter(
        e => {
          if (this.organisations.length > 0) {
            return e.DonationReceipt === selected_receiptIsForDonation &&
              e.UseAsCreditReceipt === selected_receiptCreditOrDebit &&
              e.orgid === selectedOrg;
          } else {
            return e.DonationReceipt === selected_receiptIsForDonation &&
              e.UseAsCreditReceipt === selected_receiptCreditOrDebit;

          }

        });
      // this.receiptType = this.receiptTypes[0].RecieptTypeId;
      // receiptTypeId.patchValue('');


      console.log('selectRecType', this.newReceiptTypes);
    } catch (e) {
      console.log(e);
    }
  }
  setValidatorToCreditPassword() {
    if (this.receiptCreditOrDebit === true && this.paymentMethodId === 3) {
      this.creditCardPassword.setValidators(Validators.required);
      this.creditCardPassword.updateValueAndValidity({ onlySelf: true });
    } else {
      this.creditCardPassword.clearValidators();
      this.creditCardPassword.updateValueAndValidity({ onlySelf: true });
    }
  }
  radButChanged() {
    this.filterRecType();
    this.setValidatorToCreditPassword();
  }
  showRecieptTypeId() {
    this.receiptService.selectedReceiptType = this.selectedReceiptType;

    console.log(this.selectedReceiptType);
  }
  addPaymentTypeToReceipt() {
    const selectedReceiptTypeId = this.receiptTypeGroup.get('receiptTypeId').value;
    const selectedOrg = this.receiptTypeGroup.get('selectedOrg').value;
    const selected_receiptIsForDonation = this.receiptTypeGroup.get('selected_receiptIsForDonation').value;
    const paymentMethodId = this.paymentMethodId;
    const selected_receiptCreditOrDebit = this.receiptTypeGroup.get('selected_receiptCreditOrDebit').value;

    if ((selectedReceiptTypeId === null || selectedReceiptTypeId === '' || selectedReceiptTypeId === undefined)) {
      this.toaster.warning('', 'Please select receipt type', { positionClass: 'toast-top-center' });
    } else if (paymentMethodId === null || paymentMethodId === '' || paymentMethodId === undefined ||  paymentMethodId === 0 ) {
      this.toaster.warning('', 'Please select payment method', { positionClass: 'toast-top-center' });
    } else {
      for (const receiptType of this.receiptTypes) {
        if (receiptType.RecieptTypeId === selectedReceiptTypeId) {
          this.selectedReceiptType = receiptType;
        }
      }
      this.receiptService.newReceipt.Receipt.ReceiptHeader.RecieptType = selectedReceiptTypeId;
      this.receiptService.newReceipt.Receipt.ReceiptHeader.CurrencyId = this.selectedReceiptType.CurrencyId;
      if (selected_receiptCreditOrDebit === true) {
        // this.generalService.setItemToLastSelection('receiptTypeId', selectedReceiptTypeId);
        this.generalService.setItemToLastSelection('selectedOrg', selectedOrg);
        this.generalService.setItemToLastSelection('selected_receiptIsForDonation', selected_receiptIsForDonation);

        // localStorage.setItem('receiptType', selectedReceiptTypeId);
        // localStorage.setItem('selectedOrg', selectedOrg);
        // localStorage.setItem('selected_receiptIsForDonation', selected_receiptIsForDonation);
      } else {
        this.generalService.setItemToLastSelection('receiptTypeId', selectedReceiptTypeId);
        this.generalService.setItemToLastSelection('selectedOrg', selectedOrg);
        this.generalService.setItemToLastSelection('selected_receiptIsForDonation', selected_receiptIsForDonation);
        // localStorage.removeItem('receiptType');
        // localStorage.removeItem('selectedOrg');
        // localStorage.removeItem('selected_receiptIsForDonation');
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
      this.generalService.setItemToLastSelection('paymenthMethodId', paymentMethodId);

      // localStorage.setItem('paymenthMethod', paymentMethodId);

      // this.receiptService.newReceipt.receiptType = this.selectOptForReceiptType;
      this.receiptService.checkSelectedRecType.next();
      console.log(this.receiptTypeGroup.value);
      console.log(this.receiptService.newReceipt);
      this.receiptService.nextStep();
    }


  }
  creditCardModalOpen(paymentMethodId: number) {
    // console.log(this.isVerified);
    // console.log(this.selectedPayMethod);
    this.checkPayType(paymentMethodId);
    this._paymentMethodId = paymentMethodId;
    // if (paymentMethodId === undefined) {
    //   this._paymentMethodId = +localStorage.getItem('paymenthMethod');
    // }
    if (this._paymentMethodId === 3) {
      this.dialog.open(CreditCardComponent, { width: '1150px', height: '500px'});
      console.log(this.paymentMethodId);
    } else {
      return;
    }

  }
  disabledNextStep() {
    if (this.receiptTypeGroup.valid === true) {
      if (this.paymentMethodId === 3) {
        if (this.isVerified === true) {
          this.nextStepDisabled = false;
        } else {
          this.nextStepDisabled = true;
        }
      } else {
        this.nextStepDisabled = false;
      }
    } else {
      this.nextStepDisabled = true;
    }
  }
  // lastSelReceiptType() {
  //   const receiptType = localStorage.getItem('receipt-type') ? +localStorage.getItem('receipt-type') : '';
  //   return receiptType;
  // }
  checkLastSelection() {
    this.subscriptions.add(this.generalService.currentLastSelect$.subscribe((lastSelect: LastSelection) => {
        this.setReceiptType(lastSelect.receiptTypeId);
        this.setPaymentMethodId(lastSelect.paymenthMethodId);
        this.setSelectedOrg(lastSelect.selectedOrg);
        this.setSelected_receiptIsForDonation(lastSelect.selected_receiptIsForDonation);
        // this.selected_receiptCreditOrDebit(lastSelect.selected_receiptCreditOrDebit);
    },
      err => console.log('ERROR', err),

    ));
    //   let forDonation;
    //   if (localStorage.getItem('selected_receiptIsForDonation')) {
    //     forDonation = localStorage.getItem('selected_receiptIsForDonation') == 'true' ? true : false;
    //   } else {
    //     forDonation = true;
    //   }
    //   this.receiptTypeGroup.patchValue({
    //     paymentMethodId: localStorage.getItem('paymenthMethod') ? +localStorage.getItem('paymenthMethod') : '',
    //     receiptTypeId: localStorage.getItem('receipt-type') ? +localStorage.getItem('receipt-type') : '',
    //     selected_receiptIsForDonation: forDonation,
    //     selectedOrg: localStorage.getItem('selectedOrg') ? +localStorage.getItem('selectedOrg') : 1,
    //   });
  }
  clearValueOfReceiptType() {
    this.receiptTypeGroup.get('receiptTypeId').patchValue('');
    console.log('works');
  }
  ngOnDestroy() {
    console.log('RECEIPT TYPE SUBSCRIBE', this.subscriptions);
    this.subscriptions.unsubscribe();
    console.log('RECEIPT TYPE SUBSCRIBE On Destroy', this.subscriptions);
  }

}
