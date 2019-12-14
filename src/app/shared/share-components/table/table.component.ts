import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatSort, MatPaginator } from '@angular/material';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnChanges {
  @Input() buttons: { icon: string, label: string }[];
  @Input() dataSource: MatTableDataSource<any>;
  @Input() columns: { columnDef: string, header: string, cell: any }[];
  @Input() listDisplayedColumns: string[]
  @ViewChild(MatSort, { read: '' }) sort: MatSort;
  @ViewChild(MatPaginator, { read: '', }) paginator: MatPaginator;
  @Output() clickedButton = new EventEmitter();
  constructor() { }

  ngOnChanges(simpleChange) {
    console.log('DATA TABLE is CHANGED', this.dataSource, simpleChange)
  }

  getEvent($event: string, id?) {
    this.clickedButton.emit({ action: $event, item: id })
  }
}
