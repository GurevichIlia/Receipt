import { GetCustomerReceipts } from './../../models/customer-info-by-ID.model';
import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CustomerInfoById } from 'src/app/models/customer-info-by-ID.model';
import { MatTableDataSource } from '@angular/material';
import { CustomerPaymentsComponent } from './customer-payments/customer-payments.component';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';

interface DisplayedColumns {
  value: string,
  label: string
}
@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.css']
})
export class PaymentsListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() customerInfo: CustomerInfoById;
  @ViewChild(CustomerPaymentsComponent, { read: '' }) customerPaymentsComponent: CustomerPaymentsComponent
  displayedColumns: DisplayedColumns[] = [];
  listDisplayedColumns: string[] = []
  columns: { columnDef: string, header: string, cell: any }[] = []
  dataSource = new MatTableDataSource<any>([]);
  constructor(
    // private generalService: GeneralSrv
  ) { }

  ngOnInit() {

  }
  ngOnChanges() {
    this.getDataForTable(this.customerInfo);
  }
  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.

    // this.dataSource.sortingDataAccessor = (item, property) => {
    //   switch (property) {
    //     case 'RecieptDate': return new Date(item.RecieptDate);
    //     case 'ValueDate': return new Date(item.ValueDate);
    //     default: return item[property];
    //   }
    // };
  }
  getDataForTable(customerInfo: CustomerInfoById, index?: number) {
    if (customerInfo) {
      const customerData = Object.assign({}, customerInfo)
      const paymentsListData = [customerData.GetCustomerReciepts, customerData.GetCustomerReciepts_CameFrom, customerData.GetCustomerReciepts_Involved];
      // this.changeDateFormat(customerData);
      this.dataSource.data = paymentsListData[0];
      this.dataSource.sort = this.customerPaymentsComponent.sort;
      this.createTableColumns(paymentsListData[0]);
    }
  }
  /**Create header lables of columns for table */
  createTableColumns(data: GetCustomerReceipts[] | any[]) {
    if (data && data.length !== 0) {
      this.displayedColumns = [];
      Object.keys(data[0]).map(data => this.displayedColumns.push({ value: data, label: data }))
      this.listDisplayedColumns = this.displayedColumns.map(c => {
        if (c.value === 'UseAsCreditReceipt' || c.value === 'ForCanclation' || c.value === 'WhatForInThanksLet') {
          return ''
        } else {
          return c.value
        }
      }).filter(data => data !== '');
      this.getValueForColumns(this.displayedColumns);
    }
  }
  /**Create rows for table */
  getValueForColumns(displayedColumns: DisplayedColumns[]) {
    this.columns = [];
    displayedColumns.map(c =>
      this.columns.push({ columnDef: c.value, header: c.label, cell: (element: any) => `${element[c.value]}` }));
  }
}
