import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material';
import { GetCustomerReceipts } from 'src/app/models/customer-info-by-ID.model';



@Component({
  selector: 'app-payments-table-view',
  templateUrl: './payments-table-view.component.html',
  styleUrls: ['./payments-table-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsTableViewComponent implements OnInit, OnChanges {
  @Input() dataSource: MatTableDataSource<GetCustomerReceipts>;
  @Input() columns;
  @Input() listDisplayedColumns;
  @ViewChild(MatSort, { read: '' }) sort: MatSort;
  @Output() showKevaDetails = new EventEmitter();

  constructor() { }
  ngOnChanges() {
    console.log('DATA SOURCE', this.dataSource)
  }

  ngOnInit() {
  }
  detailsKeva($event) {
    this.showKevaDetails.emit($event);
  }
}
