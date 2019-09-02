import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-emails-info',
  templateUrl: './emails-info.component.html',
  styleUrls: ['./emails-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailsInfoComponent implements OnInit {
  @Input() emails: Array<FormGroup>;
  @Input() mainInfoForm: FormGroup;
  @Output() newAction = new EventEmitter();
  editMode = false;
  constructor() { }

  ngOnInit() {
  }
  createAction(action: string, subject?: any) {
    this.newAction.emit({ action, subject })
    if (action === 'editEmail') {
      this.editMode = true;
    } else if (action === 'saveEmail') {
      this.editMode = false;
    }
  }
}