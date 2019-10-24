import { CustomerInfoService } from 'src/app/receipts/customer-info/customer-info.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GeneralSrv } from './../../../receipts/services/GeneralSrv.service';
import { BehaviorSubject, Subject } from 'rxjs';

import { PaymentKeva } from 'src/app/models/paymentKeva.model';
import { Projects4Receipt } from 'src/app/models/projects4receipt.model';
import { PaymentsService } from '../../payments.service';
import { Customerinfo } from 'src/app/models/customerInfo.model';
import { ReceiptsService } from 'src/app/receipts/services/receipts.service';
import { CreditCardList } from 'src/app/models/creditCardList.model';
import * as moment from 'moment';
import { NewKevaDetails } from 'src/app/models/newKevaDetails.model';
import { Creditcard } from 'src/app/models/creditCard.model';
import { NewKevaFull } from 'src/app/models/newKevaFull';


@Injectable({
  providedIn: 'root'
})
export class NewPaymentService {
  _foundedCustomerId = new BehaviorSubject<number | string>('');
  foundedCustomerId$ = this._foundedCustomerId.asObservable();

  paymentType = new BehaviorSubject('');
  currentPaymentType$ = this.paymentType.asObservable();

  customerInfo: BehaviorSubject<Customerinfo> = new BehaviorSubject(<Customerinfo>{});
  currentCustomerInfo$ = this.customerInfo.asObservable();

  editingPayment = new BehaviorSubject<PaymentKeva | ''>('');
  currentEditingPayment$ = this.editingPayment.asObservable();

  customertCreditCardList = new BehaviorSubject<CreditCardList[]>([]);
  currentCreditCardList$ = this.customertCreditCardList.asObservable();

  _editMode = new BehaviorSubject<boolean>(false);
  editMode$ = this._editMode.asObservable();

  baseUrl = ''
  newKeva: NewKevaFull;
  newCreditCard: Creditcard = {
    accountid: '',
    ocardvaliditymonth: '',
    oCardValidityYear: '',
    ocardnumber: '',
    ocardownerid: '',
    cvv: '',
    customername: ''
  }
  constructor(
    private generalService: GeneralSrv,
    private paymentsService: PaymentsService,
  ) {

  }

  setFoundedCustomerId(customerId: number) {
    this._foundedCustomerId.next(customerId);
  }
  getfoundedCustomerId$() {
    return this.foundedCustomerId$;
  }
  getfoundedCustomerId() {
    return this._foundedCustomerId.getValue();
  }
  updatePaymentFormForEditeMode(paymentForm: FormGroup, newData: PaymentKeva | null) {
    console.log('GLDATA', this.paymentsService.getGlobalDataState())
    paymentForm.get('firstStep').patchValue({
      type: String(newData.HokType),
      status: newData.KevaStatusId,
      groups: newData.GroupId
    });
    paymentForm.get('secondStep').patchValue({
      fileAs: newData.FileAs,
      ID: newData.ID.trim(),
      tel1: newData.Phone1,
      tel2: newData.Phone2,
      remark: ''
    });
    paymentForm.get('thirdStep.bank').patchValue({
      codeBank: newData.BankCode.trim(),
      snif: newData.SnifNo.trim(),
      accNumber: newData.AccountNo.trim()
    });
    paymentForm.get('thirdStep.creditCard').patchValue({
      credCard: newData.customercreditCardid
    });
    paymentForm.get('fourthStep').patchValue({
      amount: newData.MountToCharge,
      currency: newData.CurrencyId,
      day: newData.HokChargeDay,
      company: newData.instituteId,
      startDate: this.generalService.changeDateFormat(newData.KEVAStart, 'YYYY-MM-DD'),
      endDate: this.generalService.changeDateFormat(newData.KEVAEnd, 'YYYY-MM-DD'),
      KEVAJoinDate: this.generalService.changeDateFormat(newData.KEVAJoinDate, 'YYYY-MM-DD'),
      KEVACancleDate: this.generalService.changeDateFormat(newData.KEVACancleDate, 'YYYY-MM-DD'),
      monthToCharge: newData.TotalMonthtoCharge,
      chargeMonth: newData.TotalChargedMonth,
      leftToCharge: newData.TotalLeftToCharge,
      tadirut: newData.tadirut
    });
    paymentForm.get('fifthStep').patchValue({
      receipt: newData.RecieptTypeId,// receipt ForCanclation: false
      receipt2: newData.RecieptTypeIdREC,// receipt ForCanclation: true
      goal: newData.HokDonationTypeId,
      account: newData.AccountID,
      projCat: this.searchProjectCatId(newData.ProjectName, this.paymentsService.getGlobalDataState().Projects4Receipts),
      project: this.searchProjectId(newData.ProjectName, this.paymentsService.getGlobalDataState().Projects4Receipts),
      employeeId: newData.EmployeeId,
      thanksLetter: newData.ThanksLetterId,
      receiptName: newData.FileAs,
      address: newData.Address,
      email: newData.email,
      checkbox: newData.KevaMakeRecieptByYear
    })

  }
  setNewPaymentKeva(newKevaData,
    //  creditCardData: Creditcard = this.newCreditCard
  ) {
    let creditCardData = this.newCreditCard;
    let creditCardId: number = null;
    if (typeof (newKevaData.thirdStep.creditCard.credCard) === 'object') {
      creditCardData = newKevaData.thirdStep.creditCard.credCard;
    } else if (typeof (newKevaData.thirdStep.creditCard.credCard) === 'number') {
      creditCardId = newKevaData.thirdStep.creditCard.credCard
    };
    this.newKeva = <NewKevaFull>{
      customerInfo: <Customerinfo> this.getCustomerInfoForNewKeva(),
      HokType: newKevaData.firstStep.type,
      KevaDetails: <NewKevaDetails>{
        Customerid: this.getfoundedCustomerId(),
        MountToCharge: newKevaData.fourthStep.amount,
        HokDonationTypeId: newKevaData.fifthStep.goal,
        AccountID: newKevaData.fifthStep.account,
        KEVAStart: moment(newKevaData.fourthStep.startDate).format('YYYY-MM-DD'),
        KEVAEnd: moment(newKevaData.fourthStep.endDate).format('YYYY-MM-DD'),
        KEVANAME: newKevaData.secondStep.fileAs,
        ShortComment: newKevaData.secondStep.remark,
        BankCode: newKevaData.thirdStep.bank.codeBank,
        AccountNo: newKevaData.thirdStep.bank.accNumber,
        SnifNo: newKevaData.thirdStep.bank.snif,
        ID: newKevaData.secondStep.ID.trim(),
        customercreditCardid: creditCardId,
        TotalMonthtoCharge: newKevaData.fourthStep.monthToCharge,
        TotalChargedMonth: newKevaData.fourthStep.chargeMonth,
        TotalLeftToCharge: newKevaData.fourthStep.leftToCharge,
        CurrencyId: newKevaData.fourthStep.currency,
        EmployeeId: newKevaData.fifthStep.employeeId,
        HokProjectId: newKevaData.fifthStep.project,
        KEVAJoinDate: moment(newKevaData.fourthStep.KEVAJoinDate).format('YYYY-MM-DD'),
        KEVACancleDate: moment(newKevaData.fourthStep.KEVACancleDate).format('YYYY-MM-DD'),
        LastChargeDate: '',
        HokChargeDay: newKevaData.fourthStep.day,
        instituteId: newKevaData.fourthStep.company,
        RecieptTypeId: newKevaData.fifthStep.receipt,
        RecieptTypeIdREC: newKevaData.fifthStep.receipt2,
        HokType: newKevaData.firstStep.type,
        NameOnTheReciept: newKevaData.fifthStep.receiptName,
        Address: newKevaData.fifthStep.address,
        Phone1: newKevaData.secondStep.tel1,
        Phone2: newKevaData.secondStep.tel2,
        KevaStatusId: newKevaData.firstStep.status,
        NewSumToCharge: 0,
        NewSumAfterChargeNo: 0,
        GroupId: newKevaData.firstStep.groups,
        createDate: '',
        tadirut: newKevaData.fourthStep.tadirut,
        endchargedate: '',
        maxToCharge: 0,
        ThanksLetterId: newKevaData.fifthStep.thanksLetter,
        KevaMakeRecieptByYear: newKevaData.fifthStep.kevaMakeRecieptByYear,
        email: newKevaData.fifthStep.email,
        Kevaid: null // null if it is new keva , number if exist. Getting from method setEditedKevaId;
      },
      creditCard: <Creditcard>{
        accountid: creditCardData.accountid,
        ocardvaliditymonth: creditCardData.ocardvaliditymonth,
        oCardValidityYear: creditCardData.oCardValidityYear,
        ocardnumber: creditCardData.ocardnumber,
        ocardownerid: creditCardData.ocardownerid,
        cvv: creditCardData.cvv,
        customername: creditCardData.customername
      }
    };

  }
  getCustomerInfoForNewKeva(){
   return this.paymentsService.getCustomerInfoForNewKeva();
  }
  // setCustomerInfoForNewKeva(CustomerInfoForKeva: Customerinfo) {
  //   this.newKeva.customerInfo = CustomerInfoForKeva;
  // }
  searchProjectCatId(projectName: string, projectsList: Projects4Receipt[]) {
    let projectCat;
    projectsList.filter((project: Projects4Receipt) => project.ProjectName === projectName ? projectCat = project.ProjectCategoryId : '');
    console.log('CAT', projectCat);
    return projectCat;
  }
  searchProjectId(projectName: string, projectsList: Projects4Receipt[]) {
    let projectId;
    projectsList.filter((project: Projects4Receipt) => project.ProjectName === projectName ? projectId = project.ProjectId : '');
    console.log('projectId', projectId);
    return projectId;
  }
  setPaymentType(type: string) {
    this.paymentType.next(type);
  }
  setEditingPayment(payment) {
    this.editingPayment.next(payment);
  }
  setCustomerInfo(customerInfo: Customerinfo) {
    this.customerInfo.next(customerInfo);
    console.log('CUSTOMER INFO', this.customerInfo)
  }
  setCreditCardList(creditCardList: CreditCardList[]) {
    this.customertCreditCardList.next(creditCardList);
  }
  setEditMode(value: boolean) {
    this._editMode.next(value);
  }
  getEditMode$() {
    return this.editMode$;
  }
  // setNewCreditCard(creditCard: Creditcard) {
  //   const newCreditCardCopy = creditCard;
  //   this.newCreditCard = {
  //     accountid: newCreditCardCopy.accountid,
  //     ocardvaliditymonth: newCreditCardCopy.ocardvaliditymonth,
  //     oCardValidityYear: newCreditCardCopy.oCardValidityYear,
  //     ocardnumber: newCreditCardCopy.ocardnumber,
  //     ocardownerid: newCreditCardCopy.ocardownerid,
  //     cvv: '22334',
  //     customername: newCreditCardCopy.customername
  //   }
  // }
  getNewCreditCard() {
    return this.newCreditCard;
  }
  clearNewCreditCard() {
    this.newCreditCard = {
      accountid: '',
      ocardvaliditymonth: '',
      oCardValidityYear: '',
      ocardnumber: '',
      ocardownerid: '',
      cvv: '',
      customername: ''
    }
  }
  clearNewKeva() {
    this.newKeva = <NewKevaFull>{};
    console.log('NEW KEVA AFTER CLEAR', this.newKeva);
  }
  getNewKeva() {
    return this.newKeva;
  }
  setEditKevaId(kevaId: number) {
    this.newKeva.KevaDetails.Kevaid = kevaId;
  }
}

