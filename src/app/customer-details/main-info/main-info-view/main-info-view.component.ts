import { CustomerTitle } from 'src/app/models/customerTitle.model';
import { GlobalData } from './../../../models/globalData.model';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-info-view',
  templateUrl: './main-info-view.component.html',
  styleUrls: ['./main-info-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainInfoViewComponent implements OnInit, OnChanges {
  @Input() personalInfo: FormGroup;
  @Input() globalData: GlobalData;
  @Input() filteredCustomerTitles$: Observable<CustomerTitle[]>;
  @Output() newAction = new EventEmitter();
  editMode = false;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    console.log('NG CHANGE GET GLOBAL DATA')
  }
  // changeEditMode(controlName: string) {
  //   this.editMode = !this.editMode;
  //   this.disableControls(controlName, this.editMode)
  // }
  createAction(action: string, subject?: any) {
    this.newAction.emit({ action, subject })
    if (action === 'editPersonalInfo') {
      this.editMode = true;
    } else if(action === 'savePersonalInfo') {
      this.editMode = false;
    }
  }
}
