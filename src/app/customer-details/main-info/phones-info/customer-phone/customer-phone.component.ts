import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, AfterContentInit, OnChanges, AfterViewInit, AfterContentChecked, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-customer-phone',
  templateUrl: './customer-phone.component.html',
  styleUrls: ['./customer-phone.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerPhoneComponent implements OnInit {
  @Input() phoneGroup: FormGroup;
  @Input() i: number;
  @Output() newAction = new EventEmitter();
  editMode = false;
  width = window.innerWidth;
  constructor() {

  }

  ngOnInit() {
    // console.log('CUSTOMER PHONE FORM GROUP', this.phoneGroup);
    // console.log(this.phoneGroup.controls.id.value);
    this.editMode = this.phoneGroup.value.id === '' ? true : false;
    // console.log(this.phoneGroup.value);
    console.log('EDIT MODE', this.editMode);
    if(this.phoneGroup){
      this.phoneGroup.get('Prefix').value === '' ? this.phoneGroup.get('Prefix').patchValue('972') : this.phoneGroup.get('Prefix').value;
    }
    

  }

  createAction(action: string, index?: number) {
    this.newAction.emit({ action, index })
    if (action === 'editPhone') {
      this.editMode = true;
    } else if (action === 'savePhone') {
      this.editMode = false;
    }
  }
}
