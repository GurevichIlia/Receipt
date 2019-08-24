import { UpdateKevaHistoryChargeStatus } from './../../../../models/upadateKevaHistoryChargeStatus.model';
import { KevaChargeById } from './../../../../models/kevaChargeById.model';
import { ChargeIdEditModalComponent } from './charge-id-edit-modal/charge-id-edit-modal.component';
import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatSort, MatPaginator, MatDialogRef } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { GlobalData } from 'src/app/models/globalData.model';
import { PaymentsService } from 'src/app/grid/payments.service';
import { map, takeUntil, take } from 'rxjs/operators';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { KevaCharge } from 'src/app/models/kevaCharge.model';


interface DisplayedColumns {
  value: string,
  label: string
}
interface newData {
  newData: {
    reasonRemark: string,
    reasonId: string
  }

}

@Component({
  selector: 'app-charges-by-charge-id',
  templateUrl: './charges-by-charge-id.component.html',
  styleUrls: ['./charges-by-charge-id.component.css']
})
export class ChargesByChargeIdComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { read: '' }) sort: MatSort;
  @ViewChild(MatPaginator, { read: '', }) paginator: MatPaginator;
  globalData$: Observable<GlobalData | ''>;
  displayedColumns: DisplayedColumns[] = [];
  listDisplayedColumns: string[] = []
  columns: { columnDef: string, header: string, cell: any }[] = []
  dataSource = new MatTableDataSource<any>([]);
  kevaReturnReason$: Observable<{
    ReturnResonId: number
    ReturnResonname: string
  }[]>;
  subscription$ = new Subject();
  constructor(
    private dialog: MatDialog,
    private paymentsService: PaymentsService,
    private generalService: GeneralSrv,
    private dialogRef: MatDialogRef<ChargesByChargeIdComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: KevaCharge
  ) { }

  ngOnInit() {
    // console.log('GETTING DATA MODAL', this.dialogData$);
    // this.getDataForPaymentsTable(this.dialogData$);
    // this.getKevaReturnReason();
    this.showKevaDetails(this.dialogData);
  }
  getDataForPaymentsTable(kevaCharge$: Observable<KevaChargeById[]>, index?: number) {
    kevaCharge$.pipe(takeUntil(this.subscription$))
      .subscribe(kevaCharge => {
        if (kevaCharge) {
          const paymentsListData = kevaCharge;
          // this.changeDateFormat(customerData);
          this.dataSource.data = paymentsListData;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.createTableColumns(paymentsListData);
        }
      })


  }
  /**Create header lables of columns for table */
  createTableColumns(data: KevaChargeById[]) {
    if (data && data.length !== 0) {
      this.displayedColumns = [];
      Object.keys(data[0]).map(data => this.displayedColumns.push({ value: data, label: data }))
      this.listDisplayedColumns = this.displayedColumns.map(c => {
        return c.value
      })
      this.listDisplayedColumns.unshift('details')
      this.getValueForColumns(this.displayedColumns);
    }
  }
  /**Create rows for table */
  getValueForColumns(displayedColumns: DisplayedColumns[]) {
    this.columns = [];
    displayedColumns.map(c =>
      this.columns.push({ columnDef: c.value, header: c.label, cell: (element: any) => `${element[c.value]}` }));
  }
  openChargeEditModal(data: KevaChargeById) {
    console.log('KevaChargeById', data)
    const chargeIdEdit = this.dialog.open(ChargeIdEditModalComponent, { width: '300px', height: '450px', data: { chargeById: data, reasons$: this.getKevaReturnReason() } })

    chargeIdEdit.afterClosed()
      .pipe(takeUntil(this.subscription$))
      .subscribe((newData: { action: newData | string }) => {
        debugger
        if (newData) {
          if (newData.action !== 'Cancel') {
            const newChargeStatus: UpdateKevaHistoryChargeStatus = {
              KevaHistoryid: String(data.id),
              customerid: String(data.Customerid),
              Remark: newData.action['reasonRemark'],
              ReturnResonId: String(newData.action['reasonId']),
              Kevaid: String(data.Kevaid),
              RecieptNo: data.RecieptNo,
              RecieptType: String(data.RecieptTypeId)
            }
            console.log('DATA UPDATED', newChargeStatus);
            this.updateKevaHistoryChargeStatus(this.generalService.getOrgName(), newChargeStatus);

          } else {
            console.log('CANCEL');
          }

        }
      });
  }
  showKevaDetails(keva: KevaCharge) {
    const subscription = this.paymentsService.getKevaChargesByChargeId(this.generalService.getOrgName(), keva.KevaChargeId.toString(), '')
      .pipe(map(keva => {
        keva.map(data => {
          data.chargedate = this.generalService.changeDateFormat(data.chargedate, 'YYYY-MM-DD');
          data.ValueDate = this.generalService.changeDateFormat(data.ValueDate, 'YYYY-MM-DD');
        })
        return keva;
      }), take(1))// Использую этот оператор потому что использую этот метод каждый раз для обновления данных в таблице.
      .subscribe((data: KevaChargeById[]) => {
        const paymentsListData = data;
        this.dataSource.data = paymentsListData;
        this.dataSource.sort = this.sort;
        this.createTableColumns(paymentsListData);
        console.log('DETAILS KEVA BY ID', data)
      });
    console.log('SUBSCRIPTION TEST', subscription)
  }
  getKevaReturnReason() {
    return this.kevaReturnReason$ = this.paymentsService.currentGlobalData$.pipe(map(data => data.kevaReturnReson ? data.kevaReturnReson : []));
  }
  updateKevaHistoryChargeStatus(orgName: string, newValue: UpdateKevaHistoryChargeStatus) {
    const subscription = this.paymentsService.updateKevaHistoryChargeStatus(orgName, newValue)
      .pipe(takeUntil(this.subscription$))
      .subscribe(data => {
        console.log('UPDATE RESPONSE', data);
        this.showKevaDetails(this.dialogData);
        console.log('SUBSCRT TEST 2', subscription)
      });
  }
  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
    Math.min.apply
  }
  closeModal() {
    this.dialogRef.close();
  }
}
