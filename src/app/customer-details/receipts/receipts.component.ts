import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ReceiptsService } from './receipts.service';
import { TableComponent } from 'src/app/shared/share-components/table/table.component';
import { FullCustomerDetailsById, CustomerEmails } from 'src/app/models/fullCustomerDetailsById.model';
import { SendByEmailComponent } from 'src/app/shared/modals/send-by-email/send-by-email.component';
import { Router } from '@angular/router';
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
  filterLables = ['UseAsCreditReceipt', 'ForCanclation', 'WhatForInThanksLet', 'RecieptTypeId'];
  buttonsForTable: { icon: string, label: string }[];
  customerEmailsList: CustomerEmails[];
  constructor(
    private receiptsService: ReceiptsService,
    private matDialog: MatDialog,
    private router: Router

  ) { }

  ngOnInit() {
    this.getCustomerDetailsById();
  }

  getCustomerDetailsById() {
    this.receiptsService.getCustomerDetailsById()
      .pipe(
        filter(data => data !== null),
        takeUntil(this.subscription$))
      .subscribe((data: FullCustomerDetailsById) => {
        if (data) {
          this.setDataToTable(data);
          this.setCustomerEmails(data.CustomerEmails);
        }

      })
  }

  setDataToTable(data: FullCustomerDetailsById) {
    if (data.GetCustomerReciepts) {
      this.receiptsService.setDataSourceTable(this.customerReceiptsDataSource, [...data.GetCustomerReciepts], this.customerReceiptsTableComponent);
      this.listDisplayedColumns = this.receiptsService.setDisplayedColumns(data.GetCustomerReciepts, this.filterLables)
    }

    if (data.GetCustomerReciepts_CameFrom) {
      this.receiptsService.setDataSourceTable(this.receiptsCameFromDataSource, [...data.GetCustomerReciepts_CameFrom], this.receiptsCameFromTableComponent);
    }

    if (data.GetCustomerReciepts_Involved) {
      this.receiptsService.setDataSourceTable(this.receiptsInvolvedDataSource, [...data.GetCustomerReciepts_Involved], this.receiptsInvolvedTableComponent);
    }

    this.columns = this.receiptsService.selColumns(this.listDisplayedColumns);
    this.receiptsService.addDisplayedColumnToTable('Email', this.listDisplayedColumns);
    this.buttonsForTable = [{ icon: 'email', label: 'Email' }, { icon: 'create', label: 'Create' }]
  }

  getEventFromChildren($event: { action: string, item: any }) {
    console.log($event)
    this.openModalSendByEmail(this.customerEmailsList, $event.item)
  }

  openModalSendByEmail(emailsList: CustomerEmails[] = [], receipt) {
    const openedDialog = this.matDialog.open(SendByEmailComponent, { width: '350px', height: '270px', data: emailsList });

    openedDialog.afterClosed()
      .pipe(
        filter(data => data !== (null || undefined)),
        takeUntil(this.subscription$))
      .subscribe((sendByEmail: boolean) => {
        if (sendByEmail === true) {
          console.log(sendByEmail, receipt);
        } else {
          console.log("cancel")
        }
      })
  }

  setCustomerEmails(emailsList: CustomerEmails[]) {
    this.customerEmailsList = emailsList;
  }

  goToCreateNewReceiptPage() {
    this.receiptsService.goToCreateNewReceiptPage();
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
