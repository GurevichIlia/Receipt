import { CustomerDetailsService } from './../../../customer-details/customer-details.service';
import { ChargesByChargeIdComponent } from './charges-byChargeId-modal/charges-by-charge-id.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { KevaCharge } from './../../../models/kevaCharge.model';
import { GeneralSrv } from './../../../shared/services/GeneralSrv.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PaymentsService } from '../../payments.service';
import { Observable, Subject } from 'rxjs';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { takeUntil, map } from 'rxjs/operators';
import { PaymentsTableViewComponent } from './payments-table-view/payments-table-view.component';
import { GlobalData } from 'src/app/models/globalData.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Location } from '@angular/common';
import { KevaChargeById } from 'src/app/models/kevaChargeById.model';


interface DisplayedColumns {
  value: string,
  label: string
}

@Component({
  selector: 'app-payments-history',
  templateUrl: './payments-history.component.html',
  styleUrls: ['./payments-history.component.css']
})
export class PaymentsHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(PaymentsTableViewComponent, { read: '' }) paymentsTableViewComponent: PaymentsTableViewComponent
  @ViewChild(MatPaginator, { read: '', }) paginator: MatPaginator;
  globalData$: Observable<GlobalData | ''>;
  displayedColumns: DisplayedColumns[] = [];
  listDisplayedColumns: string[] = []
  columns: { columnDef: string, header: string, cell: any }[] = []
  dataSource = new MatTableDataSource<any>([]);
  subscription$ = new Subject();
  filterForm: FormGroup
  constructor(
    private paymentsService: PaymentsService,
    private generalService: GeneralSrv,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private spinner: NgxUiLoaderService,
    private location: Location,
    private customerDetailsService: CustomerDetailsService

  ) { }

  ngOnInit() {
    this.createFilterForm();
    this.getGlobalData();
    this.getKevaCharges();
  }
  createFilterForm() {
    this.filterForm = this.fb.group({
      instituteid: [1],
    })
  }
  get filterFormValue() {
    return this.filterForm;
  }
  getGlobalData() {
    // this.paymentsService.currentGlobalData$.pipe(takeUntil(this.subscription$)).subscribe(data => {
    this.globalData$ = this.generalService.getGlobalData$();
  }
  getKevaCharges() {
    this.spinner.start();
    this.paymentsService.getKevaCharges(this.generalService.orgName, { instituteid: this.filterForm.get('instituteid').value })
      .pipe(map(keva => {
        keva.map(data => {
          data.chargedate = this.generalService.changeDateFormat(data.chargedate, 'YYYY-MM-DD');
          data.CloseDate = this.generalService.changeDateFormat(data.CloseDate, 'YYYY-MM-DD');
          data.ValueDate = this.generalService.changeDateFormat(data.ValueDate, 'YYYY-MM-DD');
        })
        return keva;
      }),
        takeUntil(this.subscription$))
      .subscribe(data => {
        this.spinner.stop();
        this.getDataForPaymentsTable(data);
      }, error => {
        this.spinner.stop();
        alert('Something went wrong')
      });
  }
  getDataForPaymentsTable(kevaCharge: KevaCharge[], index?: number) {
    if (kevaCharge) {
      const paymentsListData = kevaCharge;
      // this.changeDateFormat(customerData);
      this.dataSource.data = paymentsListData;
      this.dataSource.sort = this.paymentsTableViewComponent.sort;
      this.dataSource.paginator = this.paginator;
      this.createTableColumns(paymentsListData);
    }

  }
  /**Create header lables of columns for table */
  createTableColumns(data: KevaCharge[]) {
    if (data && data.length !== 0) {
      this.displayedColumns = [];
      Object.keys(data[0]).map(data => this.displayedColumns.push({ value: data, label: data }))
      this.listDisplayedColumns = this.displayedColumns.map(c => {
        return c.value
      }).filter(column => {
        if (column !== 'employeeIdEnd' && column !== 'employeeIdStart' && column !== 'instituteId') {
          return column;
        }
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

  showKevaDetails(keva: KevaCharge) {
    this.dialog.open(ChargesByChargeIdComponent, { width: '1500px', height: '700px', data: { keva } })

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  goBack() {
    this.location.back();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
  }
}
