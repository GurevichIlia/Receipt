import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MainInfoService } from '../main-info.service';

@Component({
  selector: 'app-emails-info',
  templateUrl: './emails-info.component.html',
  styleUrls: ['./emails-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailsInfoComponent implements OnInit, OnDestroy {
  @Input() emails: FormArray;
  @Input() mainInfoForm: FormGroup;
  @Output() newAction = new EventEmitter();
  editMode = false;
  constructor(private mainInfoService: MainInfoService) { }

  ngOnInit() {
  }

  createAction(event$: { action: string, subject?: any }) {
    this.newAction.emit(event$)
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.createAction({ action: 'saveEmail', subject: this.emails});
    this.mainInfoForm.get('emails').disable({onlySelf: true});
    this.mainInfoService.removeEmptyControl(this.emails, 'email')
  }
}