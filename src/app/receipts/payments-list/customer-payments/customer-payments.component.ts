import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { MatSort } from '@angular/material';
import { GetCustomerReceipts } from 'src/app/models/customer-info-by-ID.model';

@Component({
  selector: 'app-customer-payments',
  templateUrl: './customer-payments.component.html',
  styleUrls: ['./customer-payments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerPaymentsComponent implements OnInit, OnChanges {
  @Input() dataSource: MatTableDataSource<GetCustomerReceipts>
  @Input() columns
  @Input() listDisplayedColumns
  @ViewChild(MatSort, { read: '' }) sort: MatSort;


  constructor() { }
  ngOnChanges() {
    console.log('DATA SOURCE', this.dataSource)
  }

  ngOnInit() {
  }

}
