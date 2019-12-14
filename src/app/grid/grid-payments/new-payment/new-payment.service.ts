import { CustomerGroupsService } from './../../../core/services/customer-groups.service';
import { CustomerInfoByIdForCustomerInfoComponent } from './../../../receipts/customer-info/customer-info.service';
import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl, Validators } from '@angular/forms';

import { GeneralSrv } from './../../../receipts/services/GeneralSrv.service';
import { BehaviorSubject, Subject } from 'rxjs';

import { PaymentKeva } from 'src/app/models/paymentKeva.model';
import { Projects4Receipt } from 'src/app/models/projects4receipt.model';
import { PaymentsService, KevaRemarkForUpdate } from '../../payments.service';
import { Customerinfo } from 'src/app/models/customerInfo.model';
import { CreditCardList } from 'src/app/models/creditCardList.model';
import * as moment from 'moment';
import { NewKevaDetails } from 'src/app/models/newKevaDetails.model';
import { Creditcard } from 'src/app/models/creditCard.model';
import { NewKevaFull } from 'src/app/models/newKevaFull';
import { CustomerTitle } from 'src/app/models/globalData.model';
import { CustomerMainInfo } from 'src/app/models/customermaininfo.model';
import { filter } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class NewPaymentService {
  _foundedCustomerId = new BehaviorSubject<number>(null);
  foundedCustomerId$ = this._foundedCustomerId.asObservable();

  paymentType = new BehaviorSubject('');
  currentPaymentType$ = this.paymentType.asObservable();

  customerInfoForNewKeva: BehaviorSubject<Customerinfo> = new BehaviorSubject(null);
  currentCustomerInfoForNewKeva$ = this.customerInfoForNewKeva.asObservable();

  editingKeva = new BehaviorSubject<PaymentKeva>(null);
  currentEditingPayment$ = this.editingKeva.asObservable();

  duplicatingKeva = new BehaviorSubject<PaymentKeva>(null);
  currentDuplicatingKeva$ = this.duplicatingKeva.asObservable();

  customertCreditCardList = new BehaviorSubject<CreditCardList[]>([]);
  currentCreditCardList$ = this.customertCreditCardList.asObservable();

  kevaMode = new BehaviorSubject<string>('newKeva');
  kevaMode$ = this.kevaMode.asObservable();

  editingKevaIdAndCustomerId = new BehaviorSubject<{ kevaId: number, customerId: number }>(null);
  editingKevaIdAndCustomerId$ = this.editingKevaIdAndCustomerId.asObservable().pipe(filter(ids => ids !== null));

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
    private customerGroupsService: CustomerGroupsService
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
      fileAs: newData.KEVANAME,
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
      receiptName: newData.NameOnTheReciept,
      address: newData.Address,
      email: newData.email,
      checkbox: newData.KevaMakeRecieptByYear
    })
  }

  updatePaymentFormForDuplicateMode(paymentForm: FormGroup, newData: PaymentKeva, customerInfo: Customerinfo) {
    paymentForm.get('firstStep').patchValue({
      type: String(newData.HokType),
      status: newData.KevaStatusId,
      groups: newData.GroupId
    });
    paymentForm.get('secondStep').patchValue({
      fileAs: '',
      ID: newData.ID.trim(),
      tel1: '',
      tel2: '',
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
      receiptName: '',
      address: newData.Address,
      email: '',
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
      customerInfo: <Customerinfo>this.getCustomerInfoForNewKeva(),
      HokType: newKevaData.firstStep.type,
      KevaDetails: <NewKevaDetails>{
        Customerid: this.getfoundedCustomerId(),
        MountToCharge: newKevaData.fourthStep.amount,
        HokDonationTypeId: newKevaData.fifthStep.goal,
        AccountID: newKevaData.fifthStep.account,
        KEVAStart: moment(newKevaData.fourthStep.startDate).format('DD/MM/YYYY'),
        KEVAEnd: moment(newKevaData.fourthStep.endDate).format('DD/MM/YYYY'),
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
        KEVAJoinDate: moment(newKevaData.fourthStep.KEVAJoinDate).format('DD/MM/YYYY'),
        KEVACancleDate: moment(newKevaData.fourthStep.KEVACancleDate).format('DD/MM/YYYY'),
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


  // setCustomerInfoForNewKeva(CustomerInfoForKeva: Customerinfo) {
  //   this.newKeva.customerInfo = CustomerInfoForKeva;
  // }
  searchProjectCatId(projectName: string, projectsList: Projects4Receipt[]) {
    let projectCat = null;
    if (projectName && projectsList) {
      projectsList.filter((project: Projects4Receipt) => project.ProjectName === projectName ? projectCat = project.ProjectCategoryId : '');
      console.log('CAT', projectCat);
    }

    return projectCat;
  }

  searchProjectId(projectName: string, projectsList: Projects4Receipt[]) {
    let projectId;
    if (projectsList) {
      projectsList.filter((project: Projects4Receipt) => project.ProjectName === projectName ? projectId = project.ProjectId : '');
      console.log('projectId', projectId);
      return projectId;
    }

  }

  setPaymentType(type: string) {
    this.paymentType.next(type);
  }

  setEditingPayment(payment: PaymentKeva) {
    this.editingKeva.next(payment);
  }

  setDuplicatingKeva(keva: PaymentKeva) {
    this.duplicatingKeva.next(keva);
  }

  setCustomerInfoForNewKeva(customerInfoFromInfoComponent: CustomerInfoByIdForCustomerInfoComponent) {
    let customerInfo: Customerinfo = {
      addresses: customerInfoFromInfoComponent.customerAddress,
      customerMainInfo: customerInfoFromInfoComponent.customerMainInfo[0],
      emails: customerInfoFromInfoComponent.customerEmails,
      groups: this.customerGroupsService.getTransformedSelectedGroups(),
      phones: customerInfoFromInfoComponent.customerPhones
    };

    this.customerInfoForNewKeva.next(customerInfo);
    console.log('CUSTOMER INFO FOR NEW KEVA', customerInfo)
  }

  clearCustomerInfoForNewKeva() {
    this.customerInfoForNewKeva.next(null);
  }
  getCustomerInfoForNewKeva$() {
    return this.currentCustomerInfoForNewKeva$;
  }

  getCustomerInfoForNewKeva() {

    return this.customerInfoForNewKeva.getValue();
  }

  setCreditCardList(creditCardList: CreditCardList[]) {
    this.customertCreditCardList.next(creditCardList);
  }

  setKevaMode(value: string) {
    this.kevaMode.next(value);
  }

  getKevaMode$() {
    return this.kevaMode$;
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
    this.newKeva = null;
    console.log('NEW KEVA AFTER CLEAR', this.newKeva);
  }

  getNewKeva() {
    return this.newKeva;
  }

  setEditKevaId(kevaId: number) {
    this.newKeva.KevaDetails.Kevaid = kevaId;
  }

  setCustomerTitleAutoComplete(filteredSubject: CustomerTitle[], formControl: AbstractControl, filterKey: string) {
    return this.generalService.formControlAutoComplete(filteredSubject, formControl, filterKey);
  }

  cityAutocomplete(filteredSubject: CustomerTitle[], formControl: AbstractControl, filterKey: string) {
    return this.generalService.formControlAutoComplete(filteredSubject, formControl, filterKey);
  }

  clearCustomerDetailsInCUstomerInfoService() {
    this.paymentsService.clearCustomerDetailsInCUstomerInfoService();
  }

  createFileAs(customerMainInfo: CustomerMainInfo) {
    let fileAs: string = '';
    if (customerMainInfo) {
      if (customerMainInfo.fileAs) {
        fileAs = customerMainInfo.fileAs;
      } else {
        fileAs = `${customerMainInfo.fname} ${customerMainInfo.lname} ${customerMainInfo.company}`
      }
    }
    return fileAs;
  }

  setBankInputValidations(form: FormGroup) {
    const bank = form.get('thirdStep.bank');
    bank.get('codeBank').setValidators([Validators.required, Validators.maxLength(2)]);
    bank.get('snif').setValidators([Validators.required, Validators.maxLength(3)]);
    bank.get('accNumber').setValidators([Validators.required, Validators.maxLength(11)]);
    bank.updateValueAndValidity();
  }

  clearBankInputValidators(form: FormGroup) {
    const bank = form.get('thirdStep.bank');
    for (const key in bank['controls']) {
      bank.get(key).clearValidators();
      bank.get(key).updateValueAndValidity();
    }
  }

  setCreditCardIdValidation(form: FormGroup) {
    const credCardId = form.get('thirdStep.creditCard.credCard');
    credCardId.setValidators(Validators.required);
    credCardId.updateValueAndValidity();
  }

  clearCreditCardIdValidation(form: FormGroup) {
    const credCardId = form.get('thirdStep.creditCard.credCard');
    credCardId.clearValidators();
    credCardId.updateValueAndValidity();
  }

  updateFormControls(form: FormGroup, customerInfoById: Customerinfo) {
    this.setInputValue(form.get('secondStep.fileAs'), this.createFileAs(customerInfoById.customerMainInfo));
    this.setInputValue(form.get('fifthStep.receiptName'), this.createFileAs(customerInfoById.customerMainInfo));
    this.setInputValue(form.get('secondStep.ID'), customerInfoById.customerMainInfo.customerCode);
    this.setInputValue(form.get('secondStep.tel1'), customerInfoById.phones ? customerInfoById.phones[0].phoneNumber : '');
    this.setInputValue(form.get('secondStep.tel2'), customerInfoById.phones.length > 1 ? customerInfoById.phones[1].phoneNumber : '');
    this.setInputValue(form.get('fifthStep.email'), customerInfoById.emails.length >= 1 ? customerInfoById.emails[0].email : '');

    // Фильтруем адреса чтобы показать только главный
    // и в дальнейшем вывести его при создании платежа
    customerInfoById.addresses = customerInfoById.addresses.filter(address => address.mainAddress === true);
    const customerAddress = customerInfoById.addresses[0];
    if (customerAddress) {
      this.setInputValue(form.get('fifthStep.address'), `${customerAddress.cityName} ${customerAddress.street} ${customerAddress.street2} ${customerAddress.zip}`);

    }
  }


  setInputValue(input: AbstractControl, newValue: any) {
    if (newValue === null) {
      newValue = '';
    }
    if (input) {
      input.patchValue(newValue);
    }

  }

  getEditingKevaIdAndCustomerId$() {
    return this.editingKevaIdAndCustomerId$;
  }

  setEditingKevaIdAndCustomerId(kevaId: number, customerId: number) {
    this.editingKevaIdAndCustomerId.next({ kevaId, customerId })
  }



  // setCustomerInfoById(customerEmails: CustomerEmails[], customerPhones: CustomerPhones[], customerAddress: CustomerAddresses[],
  //   customerMainInfo: Customermaininfo[] | MainDetails[],
  //   customerCreditCardTokens?: any[], customerGroupList?: CustomerGroupById[]
  // ) {
  //   this.paymentsService.setCustomerInfoById(customerEmails, customerPhones, customerAddress,
  //     customerMainInfo,
  //     customerCreditCardTokens, customerGroupList)
  // };
}

