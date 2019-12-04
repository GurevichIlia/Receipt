import { CustomerInfoById } from 'src/app/models/customer-info-by-ID.model';
import { GeneralSrv } from './GeneralSrv.service';
import { Addresses } from '../../models/addresses.model';
import { Emails } from '../../models/emails.model';
import { Phones } from '../../models/phones.model';
import { Product } from '../../models/products.model';
import { ReceiptHeader } from '../../models/receiptHeader.model';
import { CreditCardVerify } from '../../models/credirCardVerify.model';
import { NewReceipt } from '../../models/newReceipt.model';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Customerinfo } from '../../models/customerInfo.model';
import { Creditcard } from '../../models/creditCard.model';
import { Receipt } from '../../models/receipt.model';
import { ReceiptType } from '../../models/receiptType.interface';
import { Receiptlines } from '../../models/receiptlines.model';
import { Group } from '../customer-info/customer-info.component';
import { MatDialog } from '@angular/material';
import { ReceiptGLobalData } from 'src/app/models/receiptGlobalData.model';
import { filter } from 'rxjs/operators';
import { CustomerMainInfo } from 'src/app/models/customermaininfo.model';
import { GlobalMethodsService } from 'src/app/shared/global-methods/global-methods.service';

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
  // createNewEvent = new Subject<void>();
  amount = new BehaviorSubject(this.totalAmount);
  currentAmount$ = this.amount.asObservable();

  fullReceiptData = new BehaviorSubject<ReceiptGLobalData>(null);
  fullReceiptData$ = this.fullReceiptData.asObservable().pipe(filter(data => data !== null));

  paymentsNotEmpty = false;
  blockPaymentMethod = new BehaviorSubject(this.paymentsNotEmpty);
  /** disabled payment method if user added checks for payment */
  blockPayMethod$ = this.blockPaymentMethod.asObservable();

  selReceiptCurrencyId = new BehaviorSubject('');
  /*** Show selected currency from receipt type in step(receipt type)*/
  selCurrencyId$ = this.selReceiptCurrencyId.asObservable();

  creditCard = false;
  payByCreditCard = new BehaviorSubject(this.creditCard);
  /** * Show if payment method is credit card */
  currenPayTypeCreditCard$ = this.payByCreditCard.asObservable();

  paymentId: number = null;
  paymentMethod = new BehaviorSubject(this.paymentId);
  /*** Show which payment method id selected*/
  selectedPaymentMethod = this.paymentMethod.asObservable();

  /*** Show current name of customer name for step(proccess-receipt)*/
  fullName: string;
  private customerName = new BehaviorSubject(this.fullName);
  currentFullName$ = this.customerName.asObservable();
  // verifiedCreditCardDetails: CreditCardVerify;
  currStep = new BehaviorSubject(this.step)
  currentStep$ = this.currStep.asObservable();

  totalAmountStore = null;
  storeAmount = new BehaviorSubject(this.totalAmountStore);
  currentStoreAmount$ = this.storeAmount.asObservable();

  /*** Show if customer is new or already exist*/
  newCustomer = new BehaviorSubject(true);
  currentNewCustomer$ = this.newCustomer.asObservable();

  receiptIsSubmited = false;
  receiptIsSub = new BehaviorSubject(this.receiptIsSubmited);
  currentreceiptIsSubmited$ = this.newCustomer.asObservable();

  nameOfPaymentFor = new BehaviorSubject('');
  currentNameOfPaymentFor$ = this.nameOfPaymentFor.asObservable();

  customerEmails = new Subject<Emails[]>();
  currentCustomerEmails$ = this.customerEmails.asObservable();
  // orderInStoreIsSaved = new BehaviorSubject(false);
  // currentOrderInStoreIsSaved = this.orderInStoreIsSaved.asObservable();

  customerInfoById = new BehaviorSubject<CustomerInfoById>(null);
  customerInfoById$ = this.customerInfoById.asObservable();

  unsavedData = true;
  fullAddress = new Subject<Addresses[]>();
  currentAddress = this.fullAddress.asObservable();
  
  receiptLines = new BehaviorSubject(null);
  currentReceiptLine$ = this.receiptLines.asObservable();
  changeDateFormatMethod: Function;

  constructor(
    private dialog: MatDialog,
    private globalMethodsService: GlobalMethodsService

  ) {
    this.changeDateFormatMethod = this.globalMethodsService.changeDateFormat
    console.log('RECEIPT SERVICE');
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
    this.receiptLines.next(this.newReceipt.Receipt.recieptlines);
  }

  setCustomerInfo(customerInfo) {
    this.customerInfo = customerInfo;
    console.log('receipt srvice', this.customerInfo)
  }
  getCustomerInfo() {
    return this.newReceipt.customerInfo;
  }
  setStep(index: number) {
    this.step = index;
    this.currStep.next(this.step);
  }

  nextStep() {
    this.step++;
    this.currStep.next(this.step)
    console.log('RECEIPT LINES', this.newReceipt.Receipt.recieptlines)

  }

  prevStep() {
    this.step--;
    this.currStep.next(this.step)
    console.log('RECEIPT LINES', this.newReceipt.Receipt.recieptlines)

  }

  sendReceiptToServer() {
    // console.log(this.newReceipt);
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
    const addresses = this.newReceipt.customerInfo.addresses
    const newReceiptHeader: ReceiptHeader = this.newReceipt.Receipt.ReceiptHeader;
    const newReceiptCustomerMainInfo: CustomerMainInfo = this.newReceipt.customerInfo.customerMainInfo;
    
    this.newReceipt.customerInfo.customerMainInfo.birthday = this.changeDateFormatMethod(this.newReceipt.customerInfo.customerMainInfo.birthday, 'DD/MM/YYYY')
    this.addAddressInfoToReceiptHeader(addresses, newReceiptHeader);

    // Проверяем, если есть ID то кастомер уже есть в базе
    // мы используем только его айдишник и очищаем остальные поля.
    if (newReceiptCustomerMainInfo.customerId) {
      this.newReceipt.customerInfo.customerMainInfo = {
        customerId: newReceiptCustomerMainInfo.customerId
      }
      this.newReceipt.customerInfo.emails = [];
      this.newReceipt.customerInfo.phones = [];
      this.newReceipt.customerInfo.addresses = [];
    } else {
      // Если нет, то юзер новый и мы ничего не изменяем,
      // используюем полную введенную информацию и
      // добавляем его данные еще и в хедер в new receipt.
      this.addCustomerInfoToReceiptHeader(newReceiptCustomerMainInfo, newReceiptHeader);
    }

    return this.newReceipt;
  }

  clearNewReceipt() {
    this.newReceipt = null;
  }
  // get verifiedCredCard() {
  //   return this.verifiedCreditCardDetails;
  // }
  // set customerMainInfoForCustomerInfo(customerMainInfo: CustomerMainInfo) {
  //   this.newReceipt.customerInfo.customerMainInfo = customerMainInfo;
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
  setCustomerMainfInfoToReceipt(customerMainInfo: CustomerMainInfo) {
    this.newReceipt.customerInfo.customerMainInfo = customerMainInfo;
  }
  setPhonesToReceipt(phones: Phones[]) {
    this.newReceipt.customerInfo.phones = phones;
  }
  setEmailsToReceipt(emails: Emails[]) {
    this.newReceipt.customerInfo.emails = emails;
  }
  setAddressesToReceipt(addresses: Addresses[]) {
    this.newReceipt.customerInfo.addresses = addresses;
  }
  getReceiptLines() {
    return this.newReceipt.Receipt.recieptlines;
  }
  getFirstLastName() {
    // const custInfo = this.newReceipt.customerInfo.customerMainInfo;
    // const fullName = `${custInfo.fname} ${custInfo.lname}`;
    return this.customerName.getValue()
  }
  getTz() {
    return this.newReceipt.customerInfo.customerMainInfo.customerCode;
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
  // createNewClicked() {
  //   this.createNewEvent.next()
  // }

  setCustomerInfoById(customerInfoById: CustomerInfoById) {
    this.customerInfoById.next(customerInfoById);
  }
  getCustomerInfoById$(): Observable<CustomerInfoById> {
    return this.customerInfoById$;
  }
  getCustomerInfoById(): CustomerInfoById {
    return this.customerInfoById.getValue();
  }

  setIsNewCustomer(value: boolean) {
    this.newCustomer.next(value);
  }

  setGlobalReceiptData(fullReceiptData) {
    this.fullReceiptData.next(fullReceiptData);
  }
  getGlobalReceiptData$(): Observable<ReceiptGLobalData> {
    return this.fullReceiptData$;
  }

  setCustomerInfoToNewReceipt(customerInfo: Customerinfo) {
    this.newReceipt.customerInfo = customerInfo
  }

  setFullName(fullName: string) {
    this.customerName.next(fullName);
  }

  addAddressInfoToReceiptHeader(address: Addresses[], receiptHeader: ReceiptHeader) {
    if (address) {
      receiptHeader.Zip = address[0].zip;
      receiptHeader.CityName = address[0].cityName;
      receiptHeader.Street = address[0].street;

    } else {
      receiptHeader.Zip = '';
      receiptHeader.CityName = '';
      receiptHeader.Street = '';
    }
  }

  addCustomerInfoToReceiptHeader(customerInfo: CustomerMainInfo, receiptHeader: ReceiptHeader) {
    receiptHeader.fname = customerInfo.fname;
    receiptHeader.lname = customerInfo.lname;
    receiptHeader.Company = customerInfo.company;
    receiptHeader.FileAs = customerInfo.fname;
    receiptHeader.CustomerCode = customerInfo.customerCode;
    receiptHeader.Titel = customerInfo.title;
  }
}
