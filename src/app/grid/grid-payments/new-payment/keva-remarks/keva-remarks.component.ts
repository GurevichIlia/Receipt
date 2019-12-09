import { AskQuestionComponent } from './../../../../shared/modals/ask-question/ask-question.component';
import { TableComponent } from './../../../../shared/share-components/table/table.component';
import { GeneralSrv } from './../../../../receipts/services/GeneralSrv.service';
import { Response } from 'src/app/models/response.model';

import { NewPaymentService } from './../new-payment.service';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { switchMap, tap, takeUntil, map, filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { KevaRemark } from 'src/app/grid/payments.service';
import { KevaRemarksService } from './keva-remarks.service';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { EditRemarkComponent } from './edit-remark/edit-remark.component';
@Component({
  selector: 'app-keva-remarks',
  templateUrl: './keva-remarks.component.html',
  styleUrls: ['./keva-remarks.component.css']
})
export class KevaRemarksComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('remarksTable', { read: '' }) RemarksTable: TableComponent;
  kevaRemarks$: Observable<KevaRemark[]>;
  dataSourceKevaRemarks$: Observable<MatTableDataSource<KevaRemark[]>>
  editingCustomerId: number;
  editingKevaId: number;
  editMode = false;
  editingRemarkIndex: number;
  subscription$ = new Subject();
  currentLang: string;
  dataSource: MatTableDataSource<KevaRemark[]> = new MatTableDataSource<KevaRemark[]>();
  columns: { columnDef: string, header: string, cell: any }[] = [];
  valueAndHeader: { value: string, header: string }[] = [{ value: 'Remark', header: 'Remark' }, { value: 'RDate', header: 'Date' }];
  listDisplayedColumns: string[] = [];
  buttons: { icon: string, label: string }[] = [{ icon: 'create', label: 'Edit' }, { icon: 'delete', label: 'Delete' }];
  loading = false;
  showTable: boolean = true;
  constructor(
    private kevaRemarksService: KevaRemarksService,
    private toaster: ToastrService,
    private newPaymentService: NewPaymentService,
    private matDialog: MatDialog,
    private generalService: GeneralSrv
  ) { }

  ngOnInit() {

    this.generalService.currentLang$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(lang => this.currentLang = lang)
    this.createTableColumns();
  }

  setDataToTable(kevaRemarks) {

    this.dataSource.data = kevaRemarks;
    this.dataSource.paginator = this.RemarksTable.paginator;
    this.dataSource.sort = this.RemarksTable.sort

    return of(this.dataSource);
  }



  ngAfterViewInit() {
    console.log('AFTER VIEW INIT')
    this.getKevaRemarksById$();
    // this.setDataToTable();

  }
  createTableColumns() {
    this.listDisplayedColumns = this.valueAndHeader.map(c => c.value);
    this.listDisplayedColumns.push('Edit', 'Delete');
    this.valueAndHeader.map(c => {
      if (c) {
        this.columns.push({ columnDef: c.value, header: c.header, cell: (element: any) => `${element[c.value]}` })
      }
    })
  }

  getKevaRemarksById$() {
    this.kevaRemarks$ = this.newPaymentService.getEditingKevaIdAndCustomerId$()
      .pipe(
        tap(data => console.log('IDS', data)),
        switchMap((ids: { kevaId: number, customerId: number }) => {
          this.editingCustomerId = ids.customerId;
          this.editingKevaId = ids.kevaId;

          return this.kevaRemarksService.getKevaRemarksById(ids.kevaId)

        }), switchMap(remarks => {
          if (remarks.length !== 0) {
            this.showTable = true;

            return this.setDataToTable(remarks)
          } else {
            this.showTable = false;
            return [];
          }
        }))
    this.loading = false
  }


  getActionFromRemark(event: { action: string, item: KevaRemark }, i: number) {
    switch (event.action) {
      case 'delete': this.deleteKevaRemarkById(event.item.Id, event.item.Remark)
        break
      case 'create': this.editRemark(event.item, 'Edit remark')
        break

    }
  }


  // updateKevaRemarkById(id: number, remark: string) {
  //   if (remark) {
  //     const newRemark = {
  //       id,
  //       remark,
  //       deleterow: 0,
  //       customerid: this.editingCustomerId
  //     }
  //     this.kevaRemarksService.updateKevaRemarkById(newRemark).subscribe(res => console.log(res))
  //   } else {
  //     const message = 'Please fill in the required fields';
  //     this.toaster.warning('', message, {
  //       positionClass: 'toast-top-center'
  //     });
  //   }

  // }
  confirmDelete() {
    const openedModal$ = this.matDialog.open(AskQuestionComponent,
      {
        height: '150', width: '350px', disableClose: true, position: { top: 'top' },
        panelClass: 'question',
        data: { questionText: 'Would you like to delete this remark', acceptButtonName: 'Confirm', closeButtonName: 'Cancel' }
      })
      .afterClosed().pipe(filter(answer => answer === true));
    return openedModal$
  }

  deleteKevaRemarkById(id: number, remark: string) {
    const confirmDelete$ = this.confirmDelete();
    confirmDelete$.pipe(switchMap(() => {
      const newRemark = {
        id,
        remark,
        deleterow: 1,
        customerid: this.editingCustomerId,
        kevaid: this.editingKevaId
      }
      return this.kevaRemarksService.updateKevaRemarkById(newRemark)
    })).pipe(
      takeUntil(this.subscription$))
      .subscribe((res: Response) => {
        if (!res.IsError) {

          this.successMessage();
          this.getKevaRemarksById$();

        } else {
          console.log(res)

        }

      },
        err => {
          console.log(err)
        })

  }


  editRemark(kevaRemark?: KevaRemark, title?: string) {
    this.openRemarkModal(kevaRemark, title)
  }

  addNewRemark(title?: string) {
    this.openRemarkModal(null, title)
  }

  openRemarkModal(kevaRemark?: KevaRemark, title?: string) {
    const editModal = this.matDialog.open(EditRemarkComponent, { width: '400px', height: '270px', disableClose: true, data: { kevaRemark, title } });
    editModal.afterClosed()
      .pipe(
        takeUntil(this.subscription$),
        switchMap((modalResponse: { action: boolean, payload: { id: number, remark: string } }) => {
          if (modalResponse.action) {
            const newRemark = {
              id: modalResponse.payload.id,
              remark: modalResponse.payload.remark,
              deleterow: 0,
              customerid: this.editingCustomerId,
              kevaid: this.editingKevaId
            }
            return this.kevaRemarksService.updateKevaRemarkById(newRemark)
          } else {
            return of('Cancel')
          }
        }))
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((res: any) => {

        if (res === 'Cancel') {

        } else if (!res.IsError) {

          console.log(res)
          this.successMessage();
          this.getKevaRemarksById$();

        } else {
          console.log(res)

        }

      },
        err => {

          console.log(err)
        })

  }

  successMessage() {
    const message = this.currentLang === 'he' ? 'נשמר בהצלחה' : 'Successfully';
    this.toaster.success('', message, {
      positionClass: 'toast-top-center'
    });
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
