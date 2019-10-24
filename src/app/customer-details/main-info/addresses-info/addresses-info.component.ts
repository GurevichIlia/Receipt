import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-addresses-info',
  templateUrl: './addresses-info.component.html',
  styleUrls: ['./addresses-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressesInfoComponent {
  @Input() addresses: Array<FormGroup>;
  @Input() mainInfoForm: FormGroup;
  @Output() newAction = new EventEmitter();
  editMode = false
  constructor() { }


  createAction(event$: {action: string, subject?: any}) {
    this.newAction.emit(event$);
  }
}