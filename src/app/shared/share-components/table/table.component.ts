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
  @Input() listDisplayedColumns: string[];
  @Input() isShowMenu: boolean = false
  @ViewChild(MatSort, { read: '' }) sort: MatSort;
  @ViewChild(MatPaginator, { read: '', }) paginator: MatPaginator;
  @Output() action = new EventEmitter();
  constructor() { }

  get existButtons() {
    return this.buttons
  }

  ngOnChanges(simpleChange) {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator

    if (this.existButtons) {
      this.existButtons.map(button => {
        if (!this.listDisplayedColumns.includes(button.label)) {
          this.listDisplayedColumns.push(button.label)
        }
      })
    }
  }

  dispatchAction(action: string, id?) {
    this.action.emit({ action, item: id })
  }
}
