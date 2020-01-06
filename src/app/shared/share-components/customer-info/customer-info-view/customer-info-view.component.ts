import { Observable } from 'rxjs';
import { FormGroup, FormArray } from '@angular/forms';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CustomerType } from 'src/app/models/customerType.model';
import { CustomerTitle } from 'src/app/models/globalData.model';
import * as _ from 'lodash';


@Component({
  selector: 'app-customer-info-view',
  templateUrl: './customer-info-view.component.html',
  styleUrls: ['./customer-info-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerInfoViewComponent {
  @Input() userInfoGroup: FormGroup
  @Input() filterCustomerTitle: CustomerTitle[];
  @Input() customerTypes: CustomerType[];
  @Input() cities$: Observable<any[]>;
  @Input() currentRoute: string
  @Input() requiredField: boolean;
  @Input() isShowGroupsOptions: boolean;
  @Input() showMoreInfo = false;
  @Input() currentLang: string;

  @Output() newEventFromChild = new EventEmitter();

  down
  years = _.range(new Date().getFullYear(), 1899);
  monthes = new Array(12);
  days = new Array(31);
  constructor() { }


  get phones() {
    return this.userInfoGroup.get('phones') as FormArray;
  }

  get emails() {
    return this.userInfoGroup.get('emails') as FormArray;
  }

  get addresses() {
    return this.userInfoGroup.get('addresses') as FormArray;
  }


  sendEventFromChild(action: string, index?: number) {
    this.newEventFromChild.emit({ action, index });
  }

  showMore() {
    this.showMoreInfo = !this.showMoreInfo;
  }

  scrollToElement($element): void {
    setTimeout(_ => $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"}), 200)
    
  }
}

