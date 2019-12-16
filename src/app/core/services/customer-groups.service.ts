import { CustomerGroupsGeneralSet } from './../../models/customer-info-by-ID.model';
import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject, of } from 'rxjs';

import { GeneralGroups } from 'src/app/models/generalGroups.model';
import { map, tap } from 'rxjs/operators';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { } from './../../shared/global-state-store/global-state.service';
import { TodoItemNode } from 'src/app/message/send-message.service';
import { Group } from 'src/app/receipts/customer-info/customer-info.component';

export interface SelectedCustomerGroups {
  groupId: number,
  groupName?: string
}

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupsService {
  // Список всех групп клиентов
  readonly customerGroups = new BehaviorSubject<GeneralGroups[]>([]);
  customerGroups$ = this.customerGroups.asObservable()


  addGroupsIsClicked$ = new Subject();
  groupsCondidatesToAddition: number[] = [];

  // Данные для формирования вложенного списка групп 
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(
    private generalService: GeneralSrv
  ) { }

  private getGroupsCondidatesToAddition() {
    return this.groupsCondidatesToAddition;
  }

  getSelectedGroupsId(): Group[] {
    const selectedGroupsId: Group[] = this.customerGroups.getValue().filter(groups => groups.isSelected === true).map(selectedGroup => {
      return { GroupId: selectedGroup.GroupId };
    });
    return selectedGroupsId;
  }


  setDataForGroupsTree(dataTree: TodoItemNode[]) {
    this.dataChange.next(dataTree);
  }

  deleteGroupFromList(groupId: number) {
    this.markGroupAsNotSelected(groupId);
    this.updateCustomerGroups();
  }

  addGroupsIsClicked() {
    this.addGroupsIsClicked$.next();
  }

  getAddGroupsIsClickedEvent$() {
    return this.addGroupsIsClicked$;
  }

  setSelectedGroups(customerGroupsGeneralSet: CustomerGroupsGeneralSet[]) {
    const customerGroups = customerGroupsGeneralSet.map(group => group.CustomerGeneralGroupId);
    customerGroups.map(group => this.markGroupAsSelected(group));
    this.updateCustomerGroups();
  }

  getGeneralGroups$() {
    if (this.customerGroups.getValue().length !== 0) {
      return this.getCustomerGroups$();
    } else {
      return this.generalService.GetSystemTables().pipe(map(data => data.CustomerGroupsGeneral), tap(groups => this.setCustomerGroups(groups)));
    }
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

  getNestedChildren(arr, parent) {
    const children = [];
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].GroupParenCategory == parent) {
        let groupId;
        if (arr[i].GroupId !== 0) {
          groupId = arr[i].GroupId;
        } else {

        }
        const grandChildren = this.getNestedChildren(arr, groupId);
        if (grandChildren.length) {
          arr[i].children = grandChildren;
        }
        children.push(arr[i]);
      }
    }
    // const data = this.buildFileTree(children, 0);
    // this.dataChange.next(children);
    return children;
  }

  selectGroup(groupId: number) {
    if (this.groupsCondidatesToAddition.includes(groupId)) {
      this.groupsCondidatesToAddition.splice(this.groupsCondidatesToAddition.indexOf(groupId), 1);
    } else {
      this.groupsCondidatesToAddition.push(groupId);
    }
  }

  clearGroupsCondidatesToAddition() {
    this.groupsCondidatesToAddition = [];
  }

  markSelectedGroupsInGeneralList() {
    this.getGroupsCondidatesToAddition().map(group => this.markGroupAsSelected(group));
    this.updateCustomerGroups();
  }

  getQuickListOfGroups(groups: GeneralGroups[]) {
    let quickGroups: GeneralGroups[] = [];
    if (groups.length > 0) {
      return quickGroups = groups.filter(group => group.Quick === true);
    } else {
      return quickGroups;
    }

  }

  // CUSTOMER GROUPS METHODS

  setCustomerGroups(customerGroups: GeneralGroups[]) {
    this.customerGroups.next(customerGroups);
  }

  /** GETTING GENERAL CUSTOMER GROUPS*/
  getCustomerGroups$() {
    return this.customerGroups$
  }

  /** GETTING CUSTOMER GROUPS MARKED isSelected === True */
  getSelectedGroups$(): Observable<GeneralGroups[]> {
    return this.customerGroups$.pipe(map(groups => groups.filter(group => group.isSelected === true)),
      map(groups => {
        const sortedGroups = groups.sort(this.compareName)
        return sortedGroups
      }));
  }

  /** MAKING GROUP VALUE isSelected = True */
  markGroupAsSelected(groupId: number) {
    this.customerGroups.getValue().map(group => {
      if (group.GroupId === groupId) {
        group.isSelected = true
      }
      return { ...group };
    });
    // this.setCustomerGroups([...customerGroups]);
  }

  /** MARKING GROUP VALUE isSelected = False */
  markGroupAsNotSelected(groupId: number) {
    this.customerGroups.getValue().map(group => {
      if (group.GroupId === groupId) {
        group.isSelected = false
      }
      return { ...group };
    });
    // this.setCustomerGroups([...customerGroups]);
  }

  /** MARK ALL GROUPS VALUE isSelected = False, CLEAR STATE */
  clearSelectedGroups() {
    const existingGroups = this.customerGroups.getValue()
    const customerGroups = existingGroups.map(group => {
      if (group) {
        if (group.isSelected) {
          group.isSelected = false;
          return group;
        } else {
          return { ...group };
        }
      }

    })
    this.setCustomerGroups([...customerGroups]);

  }

  /** UPDATE GROUPS TO SHOW IF THERE ARE SELECTED GROUPS*/
  updateCustomerGroups() {
    const customerGroups = this.customerGroups.getValue();
    if (customerGroups) {
      this.setCustomerGroups([...customerGroups]);

    }

  }


}

