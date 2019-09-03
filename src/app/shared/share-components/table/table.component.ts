import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { MatSort, MatPaginator } from '@angular/material';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() buttons: { icon: string, label: string }[];
  @Input() dataSource: MatTableDataSource<any>;
  @Input() columns: { columnDef: string, header: string, cell: any }[];
  @Input() listDisplayedColumns: string[]
  @ViewChild(MatSort, { read: '' }) sort: MatSort;
  @ViewChild(MatPaginator, { read: '', }) paginator: MatPaginator;
  @Output() clickedButton = new EventEmitter();
  constructor() { }


  getEvent($event: string, id?) {
    this.clickedButton.emit({ action: $event, item: id })
  }
}
