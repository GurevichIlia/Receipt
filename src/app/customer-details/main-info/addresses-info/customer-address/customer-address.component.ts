import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.css']
})
export class CustomerAddressComponent implements OnInit {
  @Input() addressGroup: FormGroup;
  @Input() i: number;
  @Output() newAction = new EventEmitter();
  editMode = false;
  width = window.innerWidth;
  constructor() { }

  ngOnInit() {
    this.editMode = this.addressGroup.value.addressId === '' ? true : false;
    // console.log('ADDRESS GROUP', this.addressGroup)
  }

  createAction(action: string, index?: number) {
    this.newAction.emit({ action, index });
    if (action === 'editAddress') {
      this.editMode = true;
    } else if (action === 'saveAddress') {
      this.editMode = false;
    }
  }
}
