import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FullCustomerDetailsById, MainDetails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerTitle } from 'src/app/models/customerTitle.model';
import { GlobalData } from './../../../models/globalData.model';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { PersonalInfoService, PersonalInfo } from './personal-info.service';
import { takeUntil, tap, filter, map } from 'rxjs/operators';
import { Response } from 'src/app/models/response.model';

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
  constructor(
    private personalInfoService: PersonalInfoService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.getPersonalInfo();
    this.getGlobalData();
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

  getPersonalInfo() {
    this.personalInfoService.getCustomerDetailsByIdState$()
      .pipe(
        filter(data => data !== null),
        map((data: FullCustomerDetailsById) => {
          // if (data !== null) {
          data.CustomerCard_MainDetails.map((details: MainDetails) => details.BirthDate = this.personalInfoService.changeDateFormat(details.BirthDate, 'DD-MM-YYYY'))
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
  // getAction(action: string, personalInfo: FormGroup) {
  //   debugger
  //   switch (action) {
  //     case 'editPersonalInfo': this.enableFormControl(personalInfo);
  //       break
  //     case 'savePersonalInfo': this.savePersonalInfo(personalInfo)
  //       break

  //   }
  // }

  savePersonalInfo(personalInfo: FormGroup) {
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

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
