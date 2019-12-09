import { GeneralGroups } from './../../../../models/generalGroups.model';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-customer-groups-view',
  templateUrl: './customer-groups-view.component.html',
  styleUrls: ['./customer-groups-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerGroupsViewComponent implements OnInit {
  @Input() selectedGroups: GeneralGroups[];
  @Output() newEventFromChild = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  sendEventFromChild() {
    this.newEventFromChild.emit();
  }
}
