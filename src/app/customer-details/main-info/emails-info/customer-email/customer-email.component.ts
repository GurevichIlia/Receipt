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
  @Input() editMode = false;
  constructor() { }

  

  ngOnInit() {
    // console.log('EMAIL FORMGROUP', this.emailGroup);
    this.editMode = this.emailGroup.value.tempid === '' ? true : false;
  }
  createAction(action: string, subject?: any) {
    this.newAction.emit({ action, subject })
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
