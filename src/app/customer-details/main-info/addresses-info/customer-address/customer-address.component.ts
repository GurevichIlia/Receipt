import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerAddressComponent implements OnInit {
  @Input() addressGroup: FormGroup;
  @Input() i: number;
  @Input() displayWidth: Observable<number>;
  @Output() newAction = new EventEmitter();
  @Input() cities$: Observable<any[]>;

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
