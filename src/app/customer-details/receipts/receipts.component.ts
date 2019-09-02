import { CustomerInfoById, GetCustomerReceipts } from './../../models/customer-info-by-ID.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ReceiptsService } from './receipts.service';
import { TableComponent } from 'src/app/shared/share-components/table/table.component';
import { TableService } from './../../shared/share-services/table.service';
@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit, OnDestroy {
  @ViewChild('CustomerReceipts', { read: '' }) customerReceiptsTableComponent: TableComponent
  @ViewChild('CameFrom', { read: '' }) receiptsCameFromTableComponent: TableComponent
  @ViewChild('Involved', { read: '' }) receiptsInvolvedTableComponent: TableComponent

  listDisplayedColumns: string[] = []
  columns: { columnDef: string, header: string, cell: any }[] = []
  customerReceiptsDataSource = new MatTableDataSource<any>([]);
  receiptsCameFromDataSource = new MatTableDataSource<any>([]);
  receiptsInvolvedDataSource = new MatTableDataSource<any>([]);
  subscription$ = new Subject();
  filterLables = ['UseAsCreditReceipt', 'ForCanclation', 'WhatForInThanksLet']
  constructor(
    private receiptsService: ReceiptsService,
    private tableService: TableService
  ) {

  }

  ngOnInit() {
    this.getCustomerDetailsById();
  }
  getCustomerDetailsById() {
    this.receiptsService.getCustomerDetailsById()
      .pipe(
        filter(data => data !== null),
        takeUntil(this.subscription$)).subscribe((data: CustomerInfoById) => {
          this.setCustomerReceiptsDataSourceTable([...data.GetCustomerReciepts]);

          this.receiptsCameFromDataSource.data = this.tableService.getDataForTable(data.GetCustomerReciepts_CameFrom);
          this.receiptsCameFromDataSource.sort = this.receiptsCameFromTableComponent.sort;

          this.receiptsInvolvedDataSource.data = this.tableService.getDataForTable(data.GetCustomerReciepts_Involved);
          this.receiptsInvolvedDataSource.sort = this.receiptsInvolvedTableComponent.sort;
          this.listDisplayedColumns = this.tableService.createTableColumns(data.GetCustomerReciepts, this.filterLables)
          this.columns = this.tableService.getValueForColumns(this.listDisplayedColumns);

        })
  }
  setCustomerReceiptsDataSourceTable(tableData: GetCustomerReceipts[]) {
    this.customerReceiptsDataSource.data = this.tableService.getDataForTable(tableData).map((data: GetCustomerReceipts) => this.receiptsService.changeDateFormat());
    this.setSortForCustomerReceiptsTable();
    this.setPaginationForCustomerReceiptsTable();
  }
  setSortForCustomerReceiptsTable() {
    this.customerReceiptsDataSource.sort = this.customerReceiptsTableComponent.sort;
  }
  setPaginationForCustomerReceiptsTable() {
    this.customerReceiptsDataSource.paginator = this.customerReceiptsTableComponent.paginator
  }
  changeDateFormate(){
    
  }
  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
