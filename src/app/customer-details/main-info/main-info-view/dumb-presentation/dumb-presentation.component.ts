import { GlobalData } from './../../../../models/globalData.model';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment'

@Component({
  selector: 'app-dumb-presentation',
  templateUrl: './dumb-presentation.component.html',
  styleUrls: ['./dumb-presentation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DumbPresentationComponent {
  @Input() personalInfo: FormGroup;
  @Input() filteredCustomerTitles: string[];
  @Input() globalData: GlobalData;
  @Input() currentLang: string;

  @Output() newAction = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log('PERSONAL INFO', this.personalInfo)
  }

  // birthdayValidate(date: string) {
  //   const newDate = date.split('/');
  //   // tslint:disable-next-line: max-line-length
  //   if (newDate[0] <= '31' && newDate[0] >= '01' && newDate[1] <= '12' && newDate[1] >= '01' && newDate[2] <= moment().format('YYYY') && newDate[2] >= '1900') {
  //     return true;

  //   } else {
  //     return false;
  //   }
  // }


  onChange(val, event) {

    if (event.keyCode !== 8) {
      if ((val.length == 2) || val.length == 5) {
        val = val + "/";
      }
      this.personalInfo.get('birthDate').setValue(val, { emitEvent: false });
    }

  }

  sendEventFromChild(action: string){
    this.newAction.emit(action)
  }
  // createAction(action: string, subject?: any) {
  //   this.newAction.emit({ action, subject })
  //   if (action === 'editPersonalInfo') {
  //     this.editMode = true;
  //   } else if (action === 'savePersonalInfo') {
  //     this.editMode = false;
  //   }
  // }

}
