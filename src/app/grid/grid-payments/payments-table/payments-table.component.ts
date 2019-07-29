import { PaymentsService } from '../../payments.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, AfterViewChecked } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.css']
})
export class PaymentsTableComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @ViewChild(MatSort, { read: '' }) sort: MatSort;
  @ViewChild(MatPaginator, { read: '', }) paginator: MatPaginator;
  @ViewChild('weight', { read: '' }) weight: ElementRef;
  title = 'app';
  formControl = new FormControl('');
  displayedColumns: { value: string, label: string }[] = [];
  listDisplayedColumns: string[] = []
  columns: { columnDef: string, header: string, cell: any }[] = []
  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  selectedCustomers: any[] = [];
  filterForm: FormGroup;
  globalData: object; // Основная дата из которой мы берем данные для фильтра и для создания новых платежей
  subscription$ = new Subject();
  constructor(
    private router: Router,
    private paymentsService: PaymentsService,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.createTableColumns();
    this.getValueForColumns();


    this.selection.onChange.pipe(takeUntil(this.subscription$)).subscribe(data => {
      this.selectedCustomers = data.source.selected;
      console.log(this.selectedCustomers)
    });
    this.createFilterForm();
    this.getPaymentsTableData();
    this.filterPaymentTable();
    // this.filterForm.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(value => {
    //   const keys = Object.keys(value);
    //   for (let i = 0; i < keys.length; i++) {
    //     value[keys[i]] = String(value[keys[i]]);
    //   }
    //   console.log(value);
    // });
  }
  createFilterForm() {
    this.filterForm = this.fb.group({
      kevaTypeid: ['1'],
      instituteid: ['1'],
      KevaStatusid: ['9999'],
      KevaGroupid: ['9999']
    })
  }
  filterPaymentTable() {
    this.paymentsService.currentFilterValue$.pipe(takeUntil(this.subscription$)).subscribe((data: string) => {
      this.applyFilter(data);
    })
  }
  /**Create header lables of columns for table */
  createTableColumns() {
    this.displayedColumns = this.paymentsService.displayedColumns;
    this.listDisplayedColumns = this.displayedColumns.map(c => c.value);
    this.listDisplayedColumns.unshift('select');
  }
  /**Create rows for table */
  getValueForColumns() {
    this.displayedColumns.map(c =>
      this.columns.push({ columnDef: c.value, header: c.label, cell: (element: any) => `${element[c.value]}` }));
  }
  get filterFormValue() {
    return this.filterForm;
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
  checkboxLabel(row?: any): string {
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
  showDetails(element) {
    this.router.navigate(['/payments-grid/customer-details'])
  }
  getPaymentsTableData() {
    this.paymentsService.currentPaymentsTableData$.subscribe((data: any[]) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  // showFilteredPayments() {
  //   this.gridService.getGridData(this.filterFormValue.value).pipe(takeUntil(this.subscription$)).subscribe(data => {

  //     console.log('DATA SOURCE', data)
  //   })
  // }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
  }
}
