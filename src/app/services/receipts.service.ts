import { ReceiptHeader } from './../models/receiptHeader.model';
import { Customermaininfo } from './../models/customermaininfo.model';
import { CreditCardVerify } from './../models/credirCardVerify.model';
import { NewReceipt } from './../models/newReceipt.model';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Customerinfo } from '../models/customerInfo.model';
import { Creditcard } from '../models/creditCard.model';
import { Receipt } from '../models/receipt.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  step = 1;
  customerInfo;
  newReceipt: NewReceipt;
  selectedReceiptType: object;
  totalAmount: number;
  checkSelectedRecType = new Subject<void>();
  createNewEvent = new Subject<void>();
  amount = new BehaviorSubject(this.totalAmount);
  currentlyAmount = this.amount.asObservable();
  // Check if array "payments" is not empty disabled payment method in customer info component
  paymentsNotEmpty = false;
  blockPaymentMethod = new BehaviorSubject(this.paymentsNotEmpty);
  blockPayMethod = this.blockPaymentMethod.asObservable();
  /**
   * Show selected currency from receipt type in step(receipt type)
   */
  selReceiptCurrencyId = new BehaviorSubject('');
  selCurrencyId = this.selReceiptCurrencyId.asObservable();
  //  Shows for components if store is open
  //  storeIsOpen = false;
  //  storeIs = new BehaviorSubject(this.storeIsOpen);
  //  statusOfStore = this.storeIs.asObservable();
  //  Shows for components if payment method is Credit Card
  creditCard = false;
  payByCreditCard = new BehaviorSubject(this.creditCard);
  payTypeCreditCard = this.payByCreditCard.asObservable();

  /**
   * Shows which payment method id selected
   */
  paymentId: number = null;
  paymentMethod = new BehaviorSubject(this.paymentId);
  selectedPaymentMethod = this.paymentMethod.asObservable();
  /**
   * Show currently name of customer name for step(proccess-receipt)
   */
  fullName: string;
  private customerName = new BehaviorSubject(this.fullName);
  currentlyName = this.customerName.asObservable();
  // verifiedCreditCardDetails: CreditCardVerify;
  currStep = new BehaviorSubject(this.step)
  currentlyStep = this.currStep.asObservable();
  constructor() {
    this.newReceipt = {
      customerInfo: <Customerinfo>{},
      Receipt: <Receipt>{
        ReceiptHeader: <ReceiptHeader>{
          RecieptType: null, //
          FileAs: '',
          WhatFor: '', // приходит 
          CurrencyId: '',
          Total: null,
          associationId: null,
          EmployeeId: '', // Приходит после того как залогинился пользователь
          ThanksLetterId: null,
          Credit4Digit: '',
          CityName: '',
          CountryCode: '',
          Street: '',
          Street2: '',
          Zip: '',
          fname: '',
          lname: '',
          Titel: '',
          MiddleName: '',
          Company: '',
          Safix: '',
          WhatForInThanksLet: '',
          TotalInLeadCurrent: 0,
          CustomizeLine: '',
          CustomerCode: '',
          SendByEmailTo: '',
        }
      },
      PaymentType: null,
      creditCard: <Creditcard>{}
    };
  }

  setCustomerInfo(customerInfo) {
    this.customerInfo = customerInfo;
    console.log('receipt srvice', this.customerInfo)
  }
  getCustomerInfo() {
    return this.customerInfo;
  }
  setStep(index: number) {
    this.step = index;
    this.currStep.next(this.step)
  }

  nextStep() {
    this.step++;
    this.currStep.next(this.step)
  }

  prevStep() {
    this.step--;
    this.currStep.next(this.step)
  }

  sendReceiptToServer() {
    // console.log(this.newReceipt);
  }
  changeCustomerName(name: string) {
    this.customerName.next(name);
    this.currentlyName.subscribe(data => console.log(data))
  }
  changeTotalAmount(amount: number) {
    this.amount.next(amount);
  }
  get selReceiptType() {
    return this.selectedReceiptType;
  }
  // get verifiedCredCard() {
  //   return this.verifiedCreditCardDetails;
  // }
  // set customerMainInfoForCustomerInfo(customerMainInfo: Customermaininfo) {
  //   this.newReceipt.customerInfo.customermaininfo = customerMainInfo;
  // }
  // get customerMainInfoForCustomerInfo() {
  //   return this.newReceipt.;
  // }


}