import { GlobalData } from './../../../../models/globalData.model';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dumb-presentation',
  templateUrl: './dumb-presentation.component.html',
  styleUrls: ['./dumb-presentation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DumbPresentationComponent  {
  @Input() personalInfo: FormGroup;
  @Input() filteredCustomerTitles: string[];
  @Input() globalData: GlobalData;
  @Output() newAction = new EventEmitter();

  editMode = false;
  constructor() { }

  ngOnInit(){
    console.log('PERSONAL INFO', this.personalInfo)
  }

  createAction(action: string, subject?: any) {
    this.newAction.emit({ action, subject })
    if (action === 'editPersonalInfo') {
      this.editMode = true;
    } else if (action === 'savePersonalInfo') {
      this.editMode = false;
    }
  }

}
