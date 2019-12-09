import { CustomerGroupsService } from './../../../core/services/customer-groups.service';
import { GlobalStateService } from './../../global-state-store/global-state.service';
import { debounceTime } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { GeneralGroups } from './../../../models/generalGroups.model';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-customer-groups-container',
  templateUrl: './customer-groups-container.component.html',
  styleUrls: ['./customer-groups-container.component.css']
})
export class CustomerGroupsContainerComponent implements OnInit, OnDestroy {
  selectedGroups$: Observable<GeneralGroups[]>
  selectedGroupsId: number[] = [];
  customerGeneralGroups$: Observable<GeneralGroups[]>
  subscription$ = new Subject();
  @Output() newEventFromChild = new EventEmitter();

  constructor(
    private globalStateService: GlobalStateService,
    private customerGroupsService: CustomerGroupsService

  ) { }

  ngOnInit() {
    this.getSelectedGroups();
  }

  getSelectedGroups() {
    this.selectedGroups$ = this.globalStateService.getSelectedGroups$()
      .pipe(
        debounceTime(1),
      )
  }

  sendEventFromChild() {
    this.customerGroupsService.addGroupsIsClicked$.next();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.subscription$.next();
    this.subscription$.complete();
  }
}
