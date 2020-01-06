
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, switchMap, filter, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { GlobalEventsService } from 'src/app/core/services/global-events.service';
import { GeneralSrv } from 'src/app/shared/services/GeneralSrv.service';
import { AskQuestionComponent } from '../../../shared/modals/ask-question/ask-question.component';
import { NewPaymentService } from '../new-payment/new-payment.service';
import { PaymentKeva } from '../../../models/paymentKeva.model';
import { PaymentsService } from '../../payments.service';


@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsTableComponent implements OnInit, OnChanges {
  @Input() filterBy: number = null;
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
  currentLang: string;
  dataSource$: Observable<MatTableDataSource<any>>
  constructor(
    private router: Router,
    private paymentsService: PaymentsService,
    private fb: FormBuilder,
    private newPaymentService: NewPaymentService,
    private matDialog: MatDialog,
    private generalService: GeneralSrv,
    private toaster: ToastrService,
    private globalEventsService: GlobalEventsService

  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.filterBy.previousValue !== changes.filterBy.currentValue) {
      this.getPaymentsTableData();
    }
  }

  ngOnInit() {
    this.createTableColumns();
    this.getValueForColumns();
    this.selection.onChange
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(data => {
        this.selectedCustomers = data.source.selected;
      });
    this.getPaymentsTableData();
    this.filterPaymentTable();
    this.filterPaymentTableByday();
    this.getCurrentPaymentTablePageIndex();
    this.generalService.currentLang$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((lang: string) => this.currentLang = lang);
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
    this.listDisplayedColumns.splice(3, 0, 'duplicate');

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
    this.router.navigate(['payments-grid/customer-details'])
  }

  // getPaymentsTableData() {
  //   this.paymentsService.currentPaymentsTableData$.pipe(
  //     map(tableData => tableData.filter(data => data.Customerid === this.filterBy || this.filterBy === null)),
  //     takeUntil(this.subscription$))
  //     .subscribe((data: any[]) => {
  //       this.selection.clear();
  //       console.log('GRID DATA', data)
  //       if (data) {
  //         this.dataSource.data = data;
  //         this.dataSourceFilterData = data;// after use to filter by day
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       }

  //     })
  // }

  getPaymentsTableData() {
    this.dataSource$ = this.paymentsService.currentPaymentsTableData$.pipe(
      map(tableData => tableData.filter(data => data.Customerid === this.filterBy || this.filterBy === null)),
      map(filteredData => {
        this.selection.clear();
        if (filteredData) {
          this.dataSource.data = filteredData;
          this.dataSourceFilterData = filteredData;// after use to filter by day
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        console.log('GRID DATA', this.dataSource)
        return this.dataSource;
      })

    )
  }


  editPaymentRow(paymentRow: PaymentKeva) {
    this.paymentsService.setRouteForComeback(this.generalService.getCurrentRoute())
    this.newPaymentService.setEditingPayment(paymentRow);
    console.log('edit row', paymentRow);
    this.newPaymentService.setKevaMode('edit');
    this.router.navigate([`payments-grid/edit`]);
    console.log('CURRENT PAGE', this.paginator.pageSizeOptions)
  }

  duplicateCustomerKeva(customerKeva: PaymentKeva) {
    this.paymentsService.setRouteForComeback(this.generalService.getCurrentRoute())
    this.newPaymentService.setDuplicatingKeva(customerKeva);
    this.newPaymentService.setKevaMode('duplicate');
    this.globalEventsService.setCustomerIdForSearch(customerKeva.Customerid)

    console.log('edit row', customerKeva);
    this.router.navigate(['payments-grid/customer-search'],
     {queryParams: {event: 'duplicate'}}
     );

  }

  deletePaymentRow(paymentRow: PaymentKeva) {
    console.log('delete row', paymentRow)
    const openedModal$ = this.matDialog.open(AskQuestionComponent,
      {
        height: '150', width: '350px', disableClose: true, position: { top: 'top' },
        panelClass: 'question',
        data: { questionText: 'Would you like to delete this payment', acceptButtonName: 'Confirm', closeButtonName: 'Cancel', item: { name: paymentRow.FileAs, id: paymentRow.Kevaid } }
      })
      .afterClosed().pipe(filter(answer => answer === true));

    const deleteRow$ = this.paymentsService.deleteCustomerKeva(this.generalService.getOrgName(), paymentRow.Customerid, paymentRow.Kevaid);

    const deleteResponse$ = openedModal$.pipe(switchMap((answer: boolean) => {
      console.log(answer)
      return deleteRow$
    }))

    deleteResponse$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(response => {
        if (response['Data'].error === 'false') {
          const message = this.currentLang === 'he' ? 'נשמר בהצלחה' : 'Successfully';
          this.toaster.success(`מספר קבע: ${response['Data'].kevaid}`, message, {
            positionClass: 'toast-top-center'
          });
          this.paymentsService.updateKevaTable();
          console.log('RESPONSE AFTER DELETE', response)
        }

      }, error => console.log(error))
  }

  setCurrentPaymentTablePageIndex(pageIndex: number, pageSize: number) {
    this.paymentsService.setPaymentTablePage({ pageIndex, pageSize });
  }

  getCurrentPaymentTablePageIndex() {
    this.paymentsService.currentPaymentTablePage$.
      pipe(
        takeUntil(this.subscription$))
      .subscribe((pageOptions: { pageIndex: number, pageSize: number }) => {
        this.paginator.pageIndex = pageOptions.pageIndex;
        this.paginator.pageSize = pageOptions.pageSize;
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.setCurrentPaymentTablePageIndex(this.paginator.pageIndex, this.paginator.pageSize);
    this.subscription$.next();
    this.subscription$.complete();
  }
}
