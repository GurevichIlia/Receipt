import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-email',
  templateUrl: './customer-email.component.html',
  styleUrls: ['./customer-email.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CustomerEmailComponent implements OnInit{
  @Input() emailGroup: FormGroup;
  @Input() i: number;
  @Output() newAction = new EventEmitter();
 editMode = false;
  width = window.innerWidth;

  constructor() { }

  

  ngOnInit() {
    // console.log('EMAIL FORMGROUP', this.emailGroup);
    this.editMode = this.emailGroup.value.tempid === '' ? true : false;
  }
  createAction(action: string, index?: any) {
    this.newAction.emit({ action, index })
    if (action === 'editEmail') {
      this.editMode = true;
    } else if (action === 'saveEmail') {
      this.editMode = false;
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    // this.createAction('saveEmail',  this.i);
  }
}
