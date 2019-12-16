import { GeneralGroups } from './../../../../models/generalGroups.model';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-customer-groups-view',
  templateUrl: './customer-groups-view.component.html',
  styleUrls: ['./customer-groups-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerGroupsViewComponent implements OnChanges {
  @Input() selectedGroups: GeneralGroups[];
  @Output() deleteGroupEvent = new EventEmitter();
  @Output() openModalEvent = new EventEmitter();
  @Input() isShowGroupsOptions: boolean;


  constructor() { }

  ngOnChanges(simpleChanges: SimpleChanges) {
    console.log('CHANGES', this.selectedGroups)
  }

  deleteGroup(groupId: number) {
    this.deleteGroupEvent.emit(groupId);
  }

  openModal(typeOfGroups: string) {
    this.openModalEvent.emit(typeOfGroups);
  }
}
