import { NewReceipt } from './../models/newReceipt.model';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  step = 0;
  customerInfo;
  newReceipt: NewReceipt = {
    customerInfo: {},
    store: {},
    receiptType: {},
    payment: {},
    proccessReceip: {},
  };
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
  constructor() {
    this.newReceipt = {
      customerInfo: {
        firstName: '',
        lastName: ''
      },
      store: {},
      receiptType: {},
      payment: {},
      proccessReceip: {},
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
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  sendReceiptToServer() {
    console.log(this.newReceipt);
  }
  changeCustomerName(name: string) {
    this.customerName.next(name);
    this.currentlyName.subscribe(data => console.log(data))
  }
  changeTotalAmount(amount: number) {
    this.amount.next(amount);
  }
  get receiptType() {
    return this.selectedReceiptType;
  }
}