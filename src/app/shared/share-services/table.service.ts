import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }


  getDataForTable(tableData: any[], index?: number) {

    if (tableData) {
      const newTableData = [...tableData];
      // const paymentsListData = [customerData.GetCustomerReciepts, customerData.GetCustomerReciepts_CameFrom, customerData.GetCustomerReciepts_Involved];
      // this.changeDateFormat(customerData);
      // this.dataSource.data = paymentsListData[0];
      // this.dataSource.sort = this.customerPaymentsComponent.sort;
      return newTableData;
    }
  }
  /**Create header lables of columns for table */
  createTableColumns(tableData: any[], filterOptions?: string[]) {
    let filteredlistOfShownColumns = []
    if (tableData && tableData.length !== 0) {
      const shownColumns = [];
      Object.keys(tableData[0]).map(data => shownColumns.push({ value: data, label: data }))
      filteredlistOfShownColumns = shownColumns
        .map(c => filterOptions.includes(c.value)? '' : c.value )
        .filter(data => data !== '');
    }
    return filteredlistOfShownColumns;
  }
  private filterLables(dataForFilter: string, filterOptions: string[]) {
    debugger
    if (filterOptions) {
      console.log(filterOptions.includes(dataForFilter))
      return filterOptions.includes(dataForFilter) ? '' : dataForFilter
    }

  }
  /**Create rows for table */
  getValueForColumns(showenColumns: any[]) {
    const columns = [];
    showenColumns.map(label =>
      columns.push({ columnDef: label, header: label, cell: (element: any) => `${element[label]}` }));
    return columns
  }
}

