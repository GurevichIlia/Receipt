import { GridService } from './../../grid.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, AfterViewChecked, AfterContentInit, AfterContentChecked } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { Router } from '@angular/router';






export interface PeriodicElement {
  name: object | string;
  position: number;
  weight: number;
  symbol: string;

}
// const ColomName: string[] = ['AccName',
//   'AccountID',
//   'AccountNo',
//   'ActiveStatus',
//   'Address',
//   'BankCode',
//   'CurrencyId',
//   'Customerid',
//   'Deceased',
//   'Deleted',
//   'EmployeeId',
//   'FileAs',
//   'GroupId',
//   'GroupName',
//   'Havur',
//   'HokChargeDay',
//   'HokDonationTypeId',
//   'HokProjectId',
//   'HokType']

let ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: { name: 'valera', first: 'red', style: 'qwer' }, weight: 1.0079, symbol: '02/03/2012' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: '09/05/2014' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: '21/12/2016' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: '12/02/2009' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: '05/08/2010' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: '07/04/2017' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: '03/10/2014' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: '09/12/2014' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: '11/04/2020' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: '19/03/2007' },

];

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.css']
})
export class GridTableComponent implements OnInit, AfterViewChecked {
  @ViewChild(MatSort, { read: '' }) sort: MatSort;
  @ViewChild(MatPaginator, { read: '', }) paginator: MatPaginator;
  @ViewChild('weight', { read: '' }) weight: ElementRef;
  title = 'app';
  formControl = new FormControl('');
  displayedColumns: string[] = [
    'select',
    'AccName',
    'AccountID',
    'AccountNo',
    'ActiveStatus',
    'Address',
    'BankCode',
    'CurrencyId',
    'Customerid',
    'EmployeeId',
    'FileAs',
    'GroupName',
    'Havur',
    'KEVAStart',
    'KEVAEnd'
  ]
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  selectedCustomers: PeriodicElement[] = [];
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private gridService: GridService
  ) {
    // this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("http://metzoke.co.il/Search/0/he");
  }

  ngOnInit() {
   
    this.selection.onChange.subscribe(data => {
      this.selectedCustomers = data.source.selected;
    })

    this.getGridData()
  }
  ngAfterViewChecked() {
    if (this.weight) {
      this.weight.nativeElement.focus()
    }
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'symbol': return new Date(item.symbol);
        default: return item[property];
      }
    };

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editElementOfTable(element) {
    element.edit = !element.edit
    this.formControl.valueChanges.subscribe(data => {
      console.log(data)
      ELEMENT_DATA = ELEMENT_DATA.map(element => {
        if (element.weight === data) {
          element.weight = data
        }
        return element;
      })
    })
    console.log(ELEMENT_DATA)
  }
  showDetails(element) {
    this.router.navigate(['/payments-grid/customer-details'])
  }
  getGridData() {
    this.gridService.getGridData().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('DATA SOURCE', this.dataSource)

    }
    )
  }
}
