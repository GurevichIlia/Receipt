import { GeneralSrv } from './GeneralSrv.service';
import { Addresses } from './../models/addresses.model';
import { Emails } from './../models/emails.model';
import { Phones } from './../models/phones.model';
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
import { LastSelection } from '../models/lastSelection.model';
import { Group } from '../receipts/customer-info/customer-info.component';
import { ConfirmPurchasesComponent } from '../receipts/modals/confirm-purchases/confirm-purchases.component';
import { MatDialog } from '@angular/material';

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
  currentAmount$ = this.amount.asObservable();
  // Check if array "payments" is not empty disabled payment method in customer info component
  paymentsNotEmpty = false;
  blockPaymentMethod = new BehaviorSubject(this.paymentsNotEmpty);
  blockPayMethod$ = this.blockPaymentMethod.asObservable();
  /**
   * Show selected currency from receipt type in step(receipt type)
   */
  selReceiptCurrencyId = new BehaviorSubject('');
  selCurrencyId$ = this.selReceiptCurrencyId.asObservable();
  /**
   * Show if payment method is credit card
   */
  creditCard = false;
  payByCreditCard = new BehaviorSubject(this.creditCard);
  currenPayTypeCreditCard$ = this.payByCreditCard.asObservable();

  /**
   * Show which payment method id selected
   */
  paymentId: number = null;
  paymentMethod = new BehaviorSubject(this.paymentId);
  selectedPaymentMethod = this.paymentMethod.asObservable();
  /**
   * Show current name of customer name for step(proccess-receipt)
   */
  fullName: string;
  private customerName = new BehaviorSubject(this.fullName);
  currentFullName$ = this.customerName.asObservable();
  // verifiedCreditCardDetails: CreditCardVerify;
  currStep = new BehaviorSubject(this.step)
  currentStep$ = this.currStep.asObservable();

  totalAmountStore = null;
  storeAmount = new BehaviorSubject(this.totalAmountStore);
  currentStoreAmount$ = this.storeAmount.asObservable();

  newCustomer = true;
  customer = new BehaviorSubject(this.newCustomer);
  currentNewCustomer$ = this.customer.asObservable();

  receiptIsSubmited = false;
  receiptIsSub = new BehaviorSubject(this.receiptIsSubmited);
  currentreceiptIsSubmited$ = this.customer.asObservable();

  nameOfPaymentFor = new BehaviorSubject('');
  currentNameOfPaymentFor$ = this.nameOfPaymentFor.asObservable();

  customerEmails = new Subject();
  currentCustomerEmails$ = this.customerEmails.asObservable();
  // orderInStoreIsSaved = new BehaviorSubject(false);
  // currentOrderInStoreIsSaved = this.orderInStoreIsSaved.asObservable();
  unsavedData = true;
  fullAddress = new Subject();
  currentAddress = this.fullAddress.asObservable();
  constructor(
    private dialog: MatDialog,
  ) {
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
    this.selectedPaymentMethod.subscribe(payId => {
      this.clearReceiptLines();
      console.log('WORK PAY METH CHANGED');
    });
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
    this.currentFullName$.subscribe(data => console.log(data))
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
  setProducts(products: Product[]) {
    this.newReceipt.Receipt.products = products;
  }
  setCustomerMainfInfo(customerMainInfo: Customermaininfo) {
    this.newReceipt.customerInfo.customermaininfo = customerMainInfo;
  }
  setPhones(phones: Phones[]) {
    this.newReceipt.customerInfo.phones = phones;
  }
  setEmails(emails: Emails[]) {
    this.newReceipt.customerInfo.emails = emails;
  }
  setAdresses(addresses: Addresses) {
    this.newReceipt.customerInfo.addresses = addresses;
  }
  getReceiptLines() {
    return this.newReceipt.Receipt.recieptlines;
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
  getReceiptHeader() {
    return this.newReceipt.Receipt.ReceiptHeader;
  }

  refreshCredirCard() {
    this.newReceipt.creditCard = <Creditcard>{};
  }
  refreshReceiptLines(value: Receiptlines[]) {
    this.newReceipt.Receipt.recieptlines = value;
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
    console.log('this.newReceipt', this.newReceipt);
  }
  setEmployeeId(employeeId: string) {
    this.newReceipt.Receipt.ReceiptHeader.EmployeeId = employeeId;
  }
  clearReceiptLines() {
    this.newReceipt.Receipt.recieptlines = [];
  }
  addGroupsToReceipt(groups: Group[]) {
    this.newReceipt.customerInfo.groups = groups;
  }
  deleteAllProductsFromStore() {
    this.newReceipt.Receipt.products = [];
  }

}
