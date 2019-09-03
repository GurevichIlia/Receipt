import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-phones-info',
  templateUrl: './phones-info.component.html',
  styleUrls: ['./phones-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhonesInfoComponent {
  @Input() phones: FormArray;
  @Input() mainInfoForm: FormGroup
  @Output() newAction = new EventEmitter();
  editMode = false;
  width = window.innerWidth;
  constructor() {
  }
  createAction(action: string, subject?: any) {
    this.newAction.emit({ action, subject })
    if (action === 'editPhone') {
      this.editMode = true;
    } else if(action === 'savePhone') {
      this.editMode = false;
    }
  }
}
