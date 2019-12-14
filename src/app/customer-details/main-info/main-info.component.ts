import { CustomerGroupsService } from './../../core/services/customer-groups.service';
import { GlobalData } from 'src/app/models/globalData.model';
import { CustomerAddresses } from './../../models/customer-info-by-ID.model';
import { CustomerPhones, FullCustomerDetailsById, CustomerEmails, MainDetails } from './../../models/fullCustomerDetailsById.model';
import { MainInfoService } from './main-info.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { CustomerTitle } from 'src/app/models/customerTitle.model';
import { MatDialog } from '@angular/material';
import { CustomerGroupsComponent } from 'src/app/shared/modals/customer-groups/customer-groups.component';




@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.css'],
})
export class MainInfoComponent implements OnInit {
  mainInfoForm: FormGroup;
  subscription$ = new Subject();
  customerPhones: CustomerPhones[];
  customerEmails: CustomerEmails[];
  customerAddresses: CustomerAddresses[];
  customerDetails: MainDetails[];
  globalData$: Observable<GlobalData>;
  filteredCustomerTitles$: Observable<CustomerTitle[]>;
  currentMenuItem = 'personalInfo';
  animationState: string;
  displayWidth$: Observable<number>;
  constructor(
    private mainInfoService: MainInfoService,
    private fb: FormBuilder,
    private customerGroupsService: CustomerGroupsService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.createMainInfoForm();
    // this.getCustomerDetailsByIdState$();
    // this.getGlobalData();
    this.getChildMenuItem();
    this.getDisplayWidth();
    this.getIfAddGroupsIsClicked();
  }

  getDisplayWidth() {
    this.displayWidth$ = this.mainInfoService.getDisplayWidth$()

  }

  createMainInfoForm() {
    this.mainInfoForm = this.fb.group({
      personalInfo: this.fb.group({
        fname: [''],
        lname: [''],
        birthDate: [''],
        company: [''],
        customerType: [''],
        title: [''],
        gender: [''],
        tz: [''],
        customerId: [''],
        spouseName: [''],
        fileAs: [''],
        afterSunset1: [''],
        remark: [''],
        contact: ['']
      }),
      phones: this.fb.array([
        // this.fb.group({
        //   phoneTypeId: [''],
        //   phoneNumber: ['', { disable: true }],
        //   Phone: ['', Validators.required],
        //   Prefix: ['972'],
        //   id: [''],
        //   Area: [''],
        //   publish: [''],
        //   isSms: [''],
        //   deleteRow: [''],
        //   comments: [''],
        // })
      ]
      ),
      emails: this.fb.array([
        // this.fb.group({
        //   emailName: [''],
        //   email: ['', [Validators.email, Validators.required]],
        //   tempid: [''],
        //   emailsex: [''],
        //   newslettere: [''],
        //   deleteRow: ['']
        // })
      ]
      ),
      addresses: this.fb.array([
        // this.fb.group({
        //   cityName: [''],
        //   street: [''],
        //   street2: [''],
        //   zip: [''],
        //   addressTypeId: [''],
        //   addressId: [''],
        //   remark: [''],
        //   mainaddress: [''],
        //   stateid: [''],
        //   deleteRow: ['']
        // })
      ])
    })

  }

  getIfAddGroupsIsClicked() {
    this.customerGroupsService.getAddGroupsIsClickedEvent$().pipe(
      takeUntil(this.subscription$))
      .subscribe(() => {
        this.openCustomerGroupsModal();
      })

  }


  openCustomerGroupsModal() {
    const groupsModal = this.matDialog.open(CustomerGroupsComponent, { width: '500px', height: '600px', disableClose: true });

  }


  getChildMenuItem() {
    this.mainInfoService.getCurrentChildMenuItem$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((data: string) => this.currentMenuItem = data);
  }


  editPhone(phone: CustomerPhones) {
    const newPhone = Object.assign({}, phone);
    newPhone.isSms = +phone.isSms;
    newPhone.publish = +phone.publish;
    newPhone.Phone = phone.Area ? phone.Area + phone.Phone : phone.Phone;
    newPhone.Area = '';
    console.log('EDITED PHONE', { phones: [newPhone] });
    return { phones: [newPhone] };
  }

  getEditedPhone(phone: CustomerPhones) {
    return this.editPhone(phone);
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
