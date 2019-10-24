import { MainInfoService } from './../main-info.service';
import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { CustomerPhones } from 'src/app/models/fullCustomerDetailsById.model';

@Component({
  selector: 'app-phones-info',
  templateUrl: './phones-info.component.html',
  styleUrls: ['./phones-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhonesInfoComponent implements OnInit, OnDestroy {
  @Input() phones: FormArray;
  @Input() mainInfoForm: FormGroup
  @Output() newAction = new EventEmitter();
  // editMode = false;
  // width = window.innerWidth;
  constructor(private mainInfoService: MainInfoService) {
  }

  ngOnInit() {
    this.connectAreaWithPhone();
  }

  createAction(event$: { action: string, subject?: any }) {
    this.newAction.emit(event$);

    // if (action === 'editPhone') {
    //   this.editMode = true;
    // } else if(action === 'savePhone') {
    //   this.editMode = false;
    // }
  }

  connectAreaWithPhone() {
    this.phones.value.map((phone: CustomerPhones) => phone.area ? phone.phone = phone.area + phone.phone : phone.phone = phone.phone);
  }
  ngOnDestroy() {
    this.mainInfoForm.get('phones').disable({ onlySelf: true });
    this.mainInfoService.removeEmptyControl(this.phones, 'Phone');
  }

}
