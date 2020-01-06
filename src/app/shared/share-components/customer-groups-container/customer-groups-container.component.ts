import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerGroupsGeneralSet } from './../../../models/customer-info-by-ID.model';
import { CustomerGroupsService } from './../../../core/services/customer-groups.service';
import { tap, takeUntil, filter, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { GeneralGroups } from './../../../models/generalGroups.model';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CustomerGroupsComponent } from '../../modals/customer-groups/customer-groups.component';
import { MatDialog } from '@angular/material';
import { AskQuestionComponent } from '../../modals/ask-question/ask-question.component';

@Component({
  selector: 'app-customer-groups-container',
  templateUrl: './customer-groups-container.component.html',
  styleUrls: ['./customer-groups-container.component.css']
})
export class CustomerGroupsContainerComponent implements OnInit, OnDestroy {
  @Input() isShowGroupsOptions: boolean;
  generalGroups: GeneralGroups[] = [];

  selectedGroups$: Observable<GeneralGroups[]>
  selectedGroupsId: number[] = [];
  customerGeneralGroups$: Observable<GeneralGroups[]>
  subscription$ = new Subject();
  treeViewGeneralGroups;


  constructor(
    private customerGroupsService: CustomerGroupsService,
    private matDialog: MatDialog,
    private toaster: ToastrService,
    private router: Router

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
          console.log('ORIGINAL GROUPS', groups)
          const generalGroups = groups.sort(this.compareName);
          if (this.customerGroupsService.originalCustomerGroups.length === 0) {
            this.customerGroupsService.setOriginalGroupsList(groups.map(group => { return { ...group } }));
          }
          this.customerGroupsService.setCustomerGroups(groups.map(group => { return { ...group } }));
          this.customerGroupsService.alreadySelectedGroupsFromCustomerInfo$
            .pipe(
              takeUntil(this.subscription$))
            .subscribe(groups => {
              if (groups) {

                this.customerGroupsService.setSelectedGroups(groups);
              }
            })

        }
      }, err => console.log(err))
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
        tap(groups => console.log('SELECTED GROUPS', groups)),

      )
  }



  openCustomerGroupsModal(typeOfGroups: string) {
    this.passDataToGroupsTree(typeOfGroups)
    const groupsModal$ = this.matDialog.open(CustomerGroupsComponent, { width: '500px', height: '600px', disableClose: true });

    groupsModal$.afterClosed()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((modalResult: boolean) => {
        if (modalResult) {
          this.saveCustomerNewGroups()
          this.customerGroupsService.markSelectedGroupsInGeneralList();

        } else {
          return this.customerGroupsService.clearGroupsCondidatesToAddition();
        }
      })
  }

  passDataToGroupsTree(typeOfGroups: string) {
    const selectedGroups = this.customerGroupsService.customerGroups.getValue();
    if (typeOfGroups === 'general') {
      this.customerGroupsService.setDataForGroupsTree(this.customerGroupsService.getNestedChildren(selectedGroups, 0)
      )
    } else if (typeOfGroups === 'quick') {
      this.customerGroupsService.setDataForGroupsTree(this.customerGroupsService.getQuickListOfGroups(selectedGroups))
    }
  }

  getGroupsFromCustomerInfo() {
    this.customerGroupsService.getAlreadySelectedGroupsFromCustomerInfo$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((groups: number[]) => {
        if (groups) {
          this.customerGroupsService.setSelectedGroups(groups)
        }
      })
  }

  saveCustomerNewGroups() {
    console.log(this.router.url)
    const customerGroupsForSaving = [
      ...this.customerGroupsService.getSelectedGroups().map(groups => { return { GroupId: groups.GroupId } }),
      ...this.customerGroupsService.groupsCondidatesToAddition.map(groups => { return { GroupId: groups } })]

    if (this.router.url === '/customer-details/customer/main-info') {
      this.customerGroupsService.saveCustomerGroups(customerGroupsForSaving)
        .pipe(
          takeUntil(this.subscription$))
        .subscribe(response => {
          console.log('AFTER SAVING GROUP', response);

          if (response) {
            if (response['Data'].error === 'false') {
              const message = 'נשמר בהצלחה';
              this.toaster.success('', message, {
                positionClass: 'toast-top-center'
              });
            }
          }
        });
    } else {
      this.customerGroupsService.setSelectedGroups(customerGroupsForSaving.map(group => group.GroupId))
    }

  }

  deleteGroup(deletedGroup: { groupId: number, groupName: string }) {
    if (this.router.url === '/customer-details/customer/main-info') {
      this.openQuestionModal(deletedGroup.groupName)
        .pipe(switchMap(answer => {
          if (answer) {
            const group = {
              GroupId: deletedGroup.groupId,
              deleteRow: 1
            }
            return this.customerGroupsService.saveCustomerGroups([group])
          }
        }))
        .pipe(
          takeUntil(this.subscription$))
        .subscribe(response => {
          console.log('AFTER DELETING GROUP', response);
          if (response) {
            if (response['Data'].error === 'false') {
              const message = 'נשמר בהצלחה';
              this.toaster.success('', message, {
                positionClass: 'toast-top-center'
              });
              this.customerGroupsService.deleteGroupFromList(deletedGroup.groupId);
            }
          }

        })
    } else {
      this.customerGroupsService.deleteGroupFromList(deletedGroup.groupId);
  

    }



  }

  openQuestionModal(groupName: string) {
    const openedModal$ = this.matDialog.open(AskQuestionComponent,
      {
        height: '150', width: '350px', disableClose: true, position: { top: 'top' },
        panelClass: 'question',
        data: { questionText: 'Would you like to delete this group', acceptButtonName: 'Confirm', closeButtonName: 'Cancel', item: { name: groupName } }
      })
      .afterClosed().pipe(filter(answer => answer === true));
    return openedModal$;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.subscription$.next();
    this.subscription$.complete();
  }
}
