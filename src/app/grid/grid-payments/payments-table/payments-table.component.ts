import { PaymentKeva } from './../../../models/paymentKeva.model';
import { PaymentsService } from '../../payments.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, AfterViewChecked, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsTableComponent implements OnInit {
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
  dataSourceFilterData: PaymentKeva[] = []
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
    this.getPaymentsTableData();
    this.filterPaymentTable();
    this.filterPaymentTableByday();
    this.getCurrentPaymentTablePageIndex();
  }
  filterPaymentTable() {
    this.paymentsService.currentFilterValue$.pipe(takeUntil(this.subscription$)).subscribe((data: string) => {

      this.applyFilter(data);
    })
  }
  filterPaymentTableByday() {
    this.paymentsService.currentFilterValueByDay$.pipe(takeUntil(this.subscription$)).subscribe((data: string) => {
      this.applyFilterByDay(data);
    })
  }
  /**Create header lables of columns for table */
  createTableColumns() {
    this.displayedColumns = this.paymentsService.displayedColumns;
    this.listDisplayedColumns = this.displayedColumns.map(c => c.value);
    this.listDisplayedColumns.unshift('select');
    this.listDisplayedColumns.splice(1, 0, 'delete');
    this.listDisplayedColumns.splice(2, 0, 'edit');

  }
  /**Create rows for table */
  getValueForColumns() {
    this.displayedColumns.map(c =>
      this.columns.push({ columnDef: c.value, header: c.label, cell: (element: any) => `${element[c.value]}` }));
  }
  // ngAfterViewChecked() {
  //   if (this.weight) {
  //     this.weight.nativeElement.focus()
  //   }
  // }
  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    // this.dataSource.sortingDataAccessor = (item, property) => {
    //   switch (property) {
    //     case 'symbol': return new Date(item.symbol);
    //     default: return item[property];
    //   }
    // };
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
  applyFilterByDay(filterValue: string) {
    this.dataSource.data = this.dataSourceFilterData.filter((data: PaymentKeva) => {
      if (data.HokChargeDay === + filterValue.trim().toLowerCase()) {
        return data
      }
      if ('' === filterValue.trim().toLowerCase()) {
        return data
      }

    })
  }
  showDetails(element) {
    this.router.navigate(['/payments-grid/customer-details'])
  }
  getPaymentsTableData() {
    this.paymentsService.currentPaymentsTableData$.pipe(
      takeUntil(this.subscription$))
      .subscribe((data: any[]) => {
        console.log('GRID DATA', data)
        this.dataSource.data = data;
        this.dataSourceFilterData = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }
  editPaymentRow(paymentRow) {
    this.paymentsService.setEditingPayment(paymentRow);
    console.log('edit row', paymentRow);
    this.router.navigate(['/payments-grid/new-payment'], paymentRow);
    this.setCurrentPaymentTablePageIndex(this.paginator.pageIndex, this.paginator.pageSize);
    console.log('CURRENT PAGE', this.paginator.pageSizeOptions)
  }
  deletePaymentRow(paymentRow) {
    console.log('delete row', paymentRow)

  }
  duplicatePaymentRow() {

  }
  setCurrentPaymentTablePageIndex(pageIndex: number, pageSize: number) {
    this.paymentsService.setPaymentTablePage({ pageIndex, pageSize });
  }
  getCurrentPaymentTablePageIndex() {
    this.paymentsService.currentPaymentTablePage$.pipe(takeUntil(this.subscription$)).subscribe((pageOptions: { pageIndex: number, pageSize: number }) => {
      this.paginator.pageIndex = pageOptions.pageIndex;
      this.paginator.pageSize = pageOptions.pageSize;
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
  }
}
