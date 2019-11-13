import { MainDetails } from 'src/app/models/fullCustomerDetailsById.model';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { MainInfoService } from '../main-info.service';
import { CustomerTitle } from 'src/app/models/globalData.model';

export interface PersonalInfo {
  fname: string;
  lname: string;
  birthDate: string;
  company: string;
  customerType: string;
  title: string;
  gender: string;
  id: number;
  spouseName: string;
  fileAs: string;
  remark: string;
  contact: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService {

  constructor(
    private fb: FormBuilder,
    private mainInfoService: MainInfoService

  ) { }

  getGlobalData$() {
    return this.mainInfoService.getGlobalData$();
  }

  getCustomerDetailsByIdState$() {
    return this.mainInfoService.getCustomerDetailsByIdState$();
  }

  customerTitleAutocomplete(filteredSubject: CustomerTitle[], titleInput: AbstractControl, filterKey: string) {
    return this.mainInfoService.customerTitleAutoComplete(filteredSubject, titleInput, filterKey);
  }


  createPersonalInfoInputsGroup(personalInfo: FormGroup, customerPersonalInfo: MainDetails) {
    console.log('METHOD IS STARTED');
    personalInfo.patchValue({
      fname: customerPersonalInfo.fname,
      lname: customerPersonalInfo.lname,
      birthDate: customerPersonalInfo.BirthDate,
      company: customerPersonalInfo.Company,
      customerType: customerPersonalInfo.CustomerType,
      title: customerPersonalInfo.Title,
      gender: customerPersonalInfo.Gender,
      id: customerPersonalInfo.ID,
      spouseName: customerPersonalInfo.SpouseName,
      fileAs: customerPersonalInfo.FileAs,
      remark: customerPersonalInfo.Remark,
      contact: ''
    })
    personalInfo.disable();
    console.log('PersonalInfo ARRAY FROM PersonalInfo SERVICE', personalInfo);
  }


  savePersonalInfoOnServer(PersonalInfo: PersonalInfo) {
    return this.mainInfoService.saveChangedCustomerData({ personalInfo: [PersonalInfo] });
  }

  disableFormControl(control: AbstractControl) {
    control.disable();
  }

  enableFormControl(control: AbstractControl) {
    control.enable();
  }

  changeDateFormat(date: string, format: string) {
    return this.mainInfoService.changeDateFormat(date, format);
  }
}
