import { CustomerGroupsService } from './../../../core/services/customer-groups.service';
import { debounceTime, tap, takeUntil, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { GeneralGroups } from './../../../models/generalGroups.model';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CustomerGroupsComponent } from '../../modals/customer-groups/customer-groups.component';
import { MatDialog } from '@angular/material';

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
  treeViewGeneralGroups;
  generalGroups: GeneralGroups[] = [];
  @Output() newEventFromChild = new EventEmitter();

  constructor(
    private customerGroupsService: CustomerGroupsService,
    private matDialog: MatDialog

  ) { }

  ngOnInit() {
    this.getGeneralGroups();
    this.getSelectedGroups();

  }

  getGeneralGroups() {
    this.customerGroupsService.getGeneralGroups$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((groups: GeneralGroups[]) => {
        if (groups) {
          const generalGroups = groups.sort(this.compareName);

          this.generalGroups = this.customerGroupsService.getNestedChildren(generalGroups, 0);
        }
      })
  }

  compareName(a: GeneralGroups, b: GeneralGroups) {
    if (a.GroupName < b.GroupName) {
      return -1;
    }
    if (a.GroupName < b.GroupName) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }


  getSelectedGroups() {
    this.selectedGroups$ = this.customerGroupsService.getSelectedGroups$()
      .pipe(
        tap(groups => console.log('SELECTED GROUPS AFTER CONFIRM ', groups)),
        debounceTime(1),
      )
  }

  deleteGroup(groupId: number) {
    this.customerGroupsService.deleteGroupFromList(groupId);
  }

  openCustomerGroupsModal(typeOfGroups: string) {
    this.passDataToGroupsTree(typeOfGroups)
    const groupsModal$ = this.matDialog.open(CustomerGroupsComponent, { width: '500px', height: '600px', disableClose: true });

    groupsModal$.afterClosed()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((modalResult: boolean) => {
        if (modalResult) {
          this.customerGroupsService.markSelectedGroupsInGeneralList();
        } else {
          return this.customerGroupsService.clearSelectedGroupsId();
        }
      })
  }

  passDataToGroupsTree(typeOfGroups: string) {
    if (typeOfGroups === 'general') {
      this.customerGroupsService.setDataForGroupsTree(this.generalGroups)
    } else if (typeOfGroups === 'quick') {
      this.customerGroupsService.setDataForGroupsTree(this.customerGroupsService.getQuickListOfGroups(this.generalGroups))
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.subscription$.next();
    this.subscription$.complete();
  }
}
