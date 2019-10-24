import { Injectable } from '@angular/core';
import { CustomerDetailsService } from '../customer-details.service';
import { MatTableDataSource } from '@angular/material';
import { TableComponent } from 'src/app/shared/share-components/table/table.component';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { TableService } from 'src/app/shared/share-services/table.service';
import { GetCustomerReceipts } from 'src/app/models/customer-info-by-ID.model';
@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  changeDateFormat = this.generalService.changeDateFormat // change date format method
  constructor(
    private customerDetailsService: CustomerDetailsService,
    private generalService: GeneralSrv,
    private tableService: TableService
  ) {

  }

  getCustomerDetailsById() {
    return this.customerDetailsService.getCustomerDetailsByIdState$();
  }
  getChangeDateFormat() {
    this.changeDateFormat = this.generalService.changeDateFormat
  }
  setDataSourceTable(table: MatTableDataSource<any>, tableData: GetCustomerReceipts[], component: TableComponent) {
    table.data = this.tableService.getDataForTable(tableData).map((data: GetCustomerReceipts) => {
      data.ValueDate = this.changeDateFormat(data.ValueDate, 'YYYY-MM-DD');
      data.RecieptDate = this.changeDateFormat(data.RecieptDate, 'YYYY-MM-DD');
      return data;
    });
    this.setSortForCustomerReceiptsTable(table, component);
    this.setPaginationForCustomerReceiptsTable(table, component);
  }
  setSortForCustomerReceiptsTable(table: MatTableDataSource<any>, component: TableComponent) {
    if (component) {
      table.sort = component.sort;
    }
  }
  setPaginationForCustomerReceiptsTable(table: MatTableDataSource<any>, component: TableComponent) {
    if (component) {
      table.paginator = component.paginator;
    }
  }
  setDisplayedColumns(dataForGetLables: any, filterOptions?: string[]) {
    return this.tableService.createTableColumns(dataForGetLables, filterOptions)

  }
  selColumns(displayedColumns: string[]) {
    return this.tableService.getValueForColumns(displayedColumns);
  }
  addDisplayedColumnToTable(newColumnLabel: string, existColumns: string[]) {
    existColumns.push(newColumnLabel);
  }
  goToCreateNewReceiptPage() {
   this.customerDetailsService.goToCreateNewReceiptPage();
  }
}
