import { NewReceipt } from './../models/newReceipt.model';

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  step = 0;
  customerInfo;
  fullName: string;
  newReceipt: NewReceipt = {
    customerInfo: {},
    store: {},
    receiptType: {},
    payment: {},
    proccessReceip: {},
  };
  totalAmount: number;
  //  Shows for components if payment method is Credit Card
  creditCard = false;
  payByCreditCard = new BehaviorSubject(this.creditCard);
  payTypeCreditCard = this.payByCreditCard.asObservable();

  // Shows which payment method id selected
  paymentId: number = null;
  paymentMethod = new BehaviorSubject(this.paymentId);
  selectedPaymentMethod = this.paymentMethod.asObservable();
  // subject = new BehaviorSubject(this.customerInfo);
  // customerInfoValue = this.subject.asObservable();
  constructor() {
    this.customerInfo = {
      customerInfo: {}
    }
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
    console.log('setStep', this.step)
  }

  nextStep() {
    this.step++;
    console.log('nextStep', this.step)
  }

  prevStep() {
    this.step--;
    console.log('prevStep', this.step)
  }
}
