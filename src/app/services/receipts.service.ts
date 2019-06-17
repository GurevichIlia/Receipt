import { Product } from './../models/products.model';
import { ReceiptHeader } from './../models/receiptHeader.model';
import { Customermaininfo } from './../models/customermaininfo.model';
import { CreditCardVerify } from './../models/credirCardVerify.model';
import { NewReceipt } from './../models/newReceipt.model';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Customerinfo } from '../models/customerInfo.model';
import { Creditcard } from '../models/creditCard.model';
import { Receipt } from '../models/receipt.model';
import { ReceiptType } from '../models/receiptType.interface';
import { Receiptlines } from '../models/receiptlines.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  step = 1;
  customerInfo;
  newReceipt: NewReceipt;
  selectedReceiptType: ReceiptType;
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

  totalAmountStore = null;
  storeAmount = new BehaviorSubject(this.totalAmountStore);
  currentlyStoreAmount = this.storeAmount.asObservable();

  newCustomer = true;
  customer = new BehaviorSubject(this.newCustomer);
  currentlyNewCustomer = this.customer.asObservable();

  receiptIsSubmited = false;
  receiptIsSub = new BehaviorSubject(this.receiptIsSubmited);
  currentlyreceiptIsSubmited = this.customer.asObservable();
  constructor() {
    this.paymentMethod.next(localStorage.getItem('paymenthMethod') ? Number(localStorage.getItem('paymenthMethod')) : null);
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
        },
        recieptlines: [],
        products: []
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
    this.currStep.next(this.step);
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
  setSelectedReceiptType(selectedReceiptType: ReceiptType) {
    this.selectedReceiptType = selectedReceiptType;
  }
  getFullNewReceipt() {
    const receiptHeader = this.newReceipt.Receipt.ReceiptHeader;
    const adress = this.newReceipt.customerInfo.addresses;
    const newReceiptHeader: ReceiptHeader = this.newReceipt.Receipt.ReceiptHeader;
    const newReceiptCustomerMainInfo: Customermaininfo = this.newReceipt.customerInfo.customermaininfo;
    newReceiptHeader.fname = newReceiptCustomerMainInfo.firstName;
    newReceiptHeader.lname = newReceiptCustomerMainInfo.lastName;
    newReceiptHeader.Company = newReceiptCustomerMainInfo.company;
    newReceiptHeader.FileAs = newReceiptCustomerMainInfo.firstName;
    newReceiptHeader.CustomerCode = this.newReceipt.customerInfo.customermaininfo.tZ;
    newReceiptHeader.Titel = this.newReceipt.customerInfo.customermaininfo.title;
    receiptHeader.Zip = adress.zip;
    receiptHeader.Street = adress.street;
    receiptHeader.CityName = adress.city;
    console.log(this.newReceipt);
    return this.newReceipt;
  }
  clearNewReceipt() {
    this.newReceipt = <NewReceipt>{};
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

  addToReceiptLines(receiptLine: Receiptlines) {
    this.newReceipt.Receipt.recieptlines.push(receiptLine);
  }
  deleteFromReceiptLines(receiptLine: Receiptlines) {
    this.newReceipt.Receipt.recieptlines = this.newReceipt.Receipt.recieptlines.filter(data => data !== receiptLine);
    console.log('this.newReceipt.Receipt.recieptline', this.newReceipt.Receipt.recieptlines);
  }
  calculateTotalAmountForReceiptLines() {
    let totalPrice = 0;
    for (const amount of this.newReceipt.Receipt.recieptlines) {
      totalPrice += amount.Amount;
    }
    this.amount.next(totalPrice);
    return totalPrice;
  }
  addAmountInLeadCurrentToReceiptLine(totalAmount: number) {
    for (const recieptline of this.newReceipt.Receipt.recieptlines) {
      recieptline.AmountInLeadCurrent = totalAmount;
    }
  }
  addCreditCardToNewReceipt(creditCard: Creditcard) {
    this.newReceipt.creditCard = creditCard;
  }
  setAssociationId(associationId: number) {
    this.newReceipt.Receipt.ReceiptHeader.associationId = associationId;
  }
  setTotalAmount(totalAmount: number) {
    if (totalAmount !== this.newReceipt.creditCard.osumtobill) {
      this.newReceipt.creditCard.osumtobill = totalAmount;
    }
    this.newReceipt.Receipt.ReceiptHeader.Total = totalAmount;
  }
  // setReceiptHeaderItems(item, value) {
  //   const receiptHeader = this.newReceipt.Receipt.ReceiptHeader;
  //   const customerInfo = this.newReceipt.customerInfo;
  //   receiptHeader[item] = customerInfo.customermaininfo[value];
  //   receiptHeader[item] = customerInfo.addresses[value];
  // }
  refreshCredirCard() {
    this.newReceipt.creditCard = <Creditcard>{};
  }
  getReceiptLines() {
    return this.newReceipt.Receipt.recieptlines;
  }
  refreshReceiptLines(value: Receiptlines[]) {
    this.newReceipt.Receipt.recieptlines = value;
  }
  getFirstLastName() {
    const custInfo = this.newReceipt.customerInfo.customermaininfo;
    const fullName = `${custInfo.firstName} ${custInfo.lastName}`;
    console.log('FULL NAME', fullName);
    return fullName;
  }
  getTz() {
    return this.newReceipt.customerInfo.customermaininfo.tZ;
  }
  getProducts() {
    return this.newReceipt.Receipt.products;
  }
  setProducts(products: Product[]) {
    this.newReceipt.Receipt.products = products;
  }
  getReceiptHeader() {
    return this.newReceipt.Receipt.ReceiptHeader;
  }
  refreshNewReceipt() {
    this.newReceipt = this.newReceipt = {
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
        },
        recieptlines: [],
        products: []
      },
      PaymentType: null,
      creditCard: <Creditcard>{}
    };
    console.log('this.newReceipt', this.newReceipt)
  }
}
