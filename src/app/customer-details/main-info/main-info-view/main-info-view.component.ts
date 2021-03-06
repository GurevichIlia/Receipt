import { GlobalMethodsService } from 'src/app/shared/global-methods/global-methods.service';
import { Component, OnInit, Input, } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { MatDialog } from '@angular/material';
import { FullCustomerDetailsById, MainDetails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerTitle } from 'src/app/models/customerTitle.model';
import { GlobalData } from './../../../models/globalData.model';

import { PersonalInfoService, PersonalInfo } from './personal-info.service';
import { takeUntil, tap, filter, map } from 'rxjs/operators';
import { Response } from 'src/app/models/response.model';
import * as moment from 'moment'

@Component({
  selector: 'app-main-info-view',
  templateUrl: './main-info-view.component.html',
  styleUrls: ['./main-info-view.component.css'],
})
export class MainInfoViewComponent implements OnInit {
  @Input() mainInfoForm: FormGroup
  filteredCustomerTitles$: Observable<CustomerTitle[]>;
  globalData$: Observable<GlobalData>;
  subscription$ = new Subject();
  personalInfo: MainDetails;
  editMode = false;
  loading = false;
  currentLang$: Observable<string>
  constructor(
    private personalInfoService: PersonalInfoService,
    private matDialog: MatDialog,
    private globalMethondsService: GlobalMethodsService
  ) { }

  ngOnInit() {
    this.getPersonalInfo();
    this.getGlobalData();
    this.getCurrentLanguage();
    // this.mainInfoForm.get('personalInfo.birthDate').valueChanges.subscribe(val => {
    //   let chIbn = val;
    //   if ((chIbn.length == 2 && chIbn[3] != '/') || chIbn.length == 5 && chIbn[6] != '/') {
    //     chIbn = chIbn + "/";
    //   }
    //   this.mainInfoForm.get('personalInfo.birthDate').setValue(chIbn, { emitEvent: false });

    // })
  }

  get personalInfoControl() {
    return this.mainInfoForm.get('personalInfo') as FormGroup;
  }

  get title() {
    return this.mainInfoForm.get('personalInfo.title');
  }

  get comment() {
    return this.mainInfoForm.get('personalInfo.remark');
  }

  get tZ() {
    return this.mainInfoForm.get('personalInfo.tz');
  }

  getPersonalInfo() {
    this.personalInfoService.getCustomerDetailsByIdState$()
      .pipe(
        filter(data => data !== null),
        map((data: FullCustomerDetailsById) => {
          // if (data !== null) {
          data.CustomerCard_MainDetails.map((details: MainDetails) => details.BirthDate = this.personalInfoService.changeDateFormat(details.BirthDate, 'DD/MM/YYYY'))
          return data;
          // }
        }),
        takeUntil(this.subscription$))
      .subscribe((customerDetails: FullCustomerDetailsById) => {
        if (customerDetails) {
          this.personalInfo = customerDetails.CustomerCard_MainDetails[0];
          this.personalInfoService.createPersonalInfoInputsGroup(this.personalInfoControl, this.personalInfo)
        }
      })
  }

  getGlobalData() {
    this.globalData$ = this.personalInfoService.getGlobalData$()
      .pipe(tap((data: GlobalData) => {
        if (data) {
          this.onFilterCustomerTitle(data.CustomerTitle);
        }
        return data
      }));;
  }

  onFilterCustomerTitle(customerTitles: CustomerTitle[]) {
    this.filteredCustomerTitles$ = this.personalInfoService.customerTitleAutocomplete(customerTitles, this.title, 'TitleHeb');
  }

  // filterCustomerTitle
  // changeEditMode(controlName: string) {
  //   this.editMode = !this.editMode;
  //   this.disableControls(controlName, this.editMode)
  // }
  getEventFromChild(action: string) {
    switch (action) {
      case 'validate': this.validateTZ();
        break

    }
  }

  savePersonalInfo(personalInfo: FormGroup) {
    personalInfo.value.birthDate = moment(personalInfo.value.birthDate).format('DD/MM/YYYY')
    this.personalInfoService.savePersonalInfoOnServer(personalInfo.value)
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((response: Response) => {
        if (response.Data.error === 'false') {
          this.disableFormControl(personalInfo);
          this.editMode = false;
          this.personalInfoService.updateCustomerInfo();
          console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
        } else if (response.Data.error === 'true') {
          console.log('RESPONSE ERROR', response.Data.res_description);
          console.log('RESPONSE AFTER SAVE CHANGED DATA', response);
        }
      },
        error => console.log(error));

  }

  editFormControl(control: AbstractControl) {
    this.enableFormControl(control);
    this.editMode = true;
  }

  disableFormControl(control: AbstractControl) {
    control.disable();
  }

  enableFormControl(control: AbstractControl) {
    control.enable();
  }

  showFullComment() {
    const commetModal = this.matDialog.open(CommentModalComponent, { width: '400px', height: '520px', data: { comment: this.comment.value } });

    commetModal.afterClosed()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((modalResult: string) => modalResult ? this.comment.patchValue(modalResult) : null)
  }

  getCurrentLanguage() {
    this.currentLang$ = this.personalInfoService.getCurrentLanguage();

  }

  validateTZ() {
    this.globalMethondsService.validateTZ(this.tZ.value);
     
   }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
