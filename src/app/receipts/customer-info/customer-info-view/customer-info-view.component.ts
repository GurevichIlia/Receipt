import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerType } from 'src/app/models/customerType.model';
import { CustomerTitle } from 'src/app/models/globalData.model';
import { CustomerGroupById } from 'src/app/models/customerGroupById.model';

@Component({
  selector: 'app-customer-info-view',
  templateUrl: './customer-info-view.component.html',
  styleUrls: ['./customer-info-view.component.css']
})
export class CustomerInfoViewComponent implements OnInit {
  @Input() userInfoGroup: FormGroup
  @Input() filterCustomerTitle: CustomerTitle[];
  @Input() customerTypes: CustomerType[];
  @Input() cities: any[];
  @Input() currentRoute: string
  @Input() requiredField: boolean;
  @Input() customerGroupList: CustomerGroupById[]
  @Output() newEventFromChild = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  get phones() {
    return this.userInfoGroup.get('phones') as FormArray;
  }
  get emails() {
    return this.userInfoGroup.get('emails') as FormArray;
  }
  get addresses() {
    return this.userInfoGroup.get('addresses') as FormArray;
  }
  sendEventFromChild(action: string, index: number) {
    this.newEventFromChild.emit({ action, index });
  }

}

