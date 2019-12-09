import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { GlobalStateService } from './../../shared/global-state-store/global-state.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { GeneralGroups } from 'src/app/models/generalGroups.model';
import { filter, map, tap } from 'rxjs/operators';

export interface SelectedCustomerGroups {
  groupId: number,
  groupName?: string
}

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupsService {
  selectedGroups = new BehaviorSubject<number[]>([]);
  selectedGroups$ = this.selectedGroups.asObservable();
  generalGroups: GeneralGroups[] = [];
  addGroupsIsClicked$ = new Subject();
  // selectedGroups = new BehaviorSubject<GeneralGroups[]>([]);
  // selectedGroups$ = this.selectedGroups.asObservable();

  constructor(
    private globalStateService: GlobalStateService,
    private generalService: GeneralSrv
  ) { }

  setGeneralGroups(generalGroups: GeneralGroups[]) {
    this.generalGroups = generalGroups;
  }

  getGeneralGroups() {
    return [...this.generalGroups];
  }

  setSelectedGroups(selectedGroup: number[]) {
    this.selectedGroups.next(selectedGroup);
  }

  getSelectedGroups$(): Observable<number[]> {
    return this.selectedGroups$;
  }

  getGeneralGroups$() {
    if (this.globalStateService.customerGroups.getValue()) {
      return this.globalStateService.getCustomerGroups$();
    } else {
      return this.generalService.GetSystemTables().pipe(map(data => data.CustomerGroupsGeneral),
        //  tap(groups => {
        //   this.globalStateService.setCustomerGroups([...groups]);
        //   console.log('GLOBAL GROUPS ПОСЛЕ ПОЛУЧЕНИЯ С СЕРВЕРА', this.globalStateService.customerGroups.getValue());
        // })
      );
    }
  }

  // addGroup(selectedGroup: number) {
  //   let selectedGroups: number[] = this.selectedGroups.getValue();
  //   if (selectedGroups.includes(selectedGroup)) {
  //     selectedGroups.splice(selectedGroups.indexOf(selectedGroup), 1);
  //   } else {
  //     selectedGroups.push(selectedGroup);
  //   }
  //   console.log('SELECTED', selectedGroups);
  //   this.setSelectedGroups(selectedGroups);
  //   return selectedGroups;
  // }


  selectGroup(selectedGroup: { isSelected: boolean, groupId: number }) {
    if (selectedGroup.isSelected === true) {
      selectedGroup.isSelected = false;
      this.globalStateService.markGroupAsNotSelected(selectedGroup.groupId)
    } else {
      selectedGroup.isSelected = true;
      this.globalStateService.markGroupAsSelected(selectedGroup.groupId)

    }
  }

  filterGroups(generalGroups$: Observable<GeneralGroups[]>, selectedGroupId: number[]) {
    const selectedGroups$ = generalGroups$
      .pipe(
        map(groups => {
          return groups.filter(group => {
            if (selectedGroupId.includes(group.GroupId)) {
              return group;
            }
          })
        }),
        tap(groups => console.log(groups))
      )
    return selectedGroups$;
  }
}
