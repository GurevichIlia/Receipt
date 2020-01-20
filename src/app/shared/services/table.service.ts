import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

  getDataForTable(tableData: any[], index?: number) {
    if (tableData) {
      const newTableData = [...tableData];
      return newTableData;
    }
  }
  /**Create header lables of columns for table
   * Создаем массив с названиями которые будут показаны в таблице
   */
  createTableColumns(tableData: any[], filterOptions: string[] = []) {
    let filteredlistOfShownColumns = []
    if (tableData && tableData.length !== 0) {
      const shownColumns = [];
      Object.keys(tableData[0]).map(data => shownColumns.push({ value: data, label: data }))
        filteredlistOfShownColumns = shownColumns
          .map(c => filterOptions.includes(c.value) ? '' : c.value)
          .filter(data => data !== '');

    }
    return filteredlistOfShownColumns;
  }

  /**Create rows for table 
   * 
  */
  getValueForColumns(showenColumns: string[]) {
    const columns = [];
    showenColumns.map(label =>
      columns.push({ columnDef: label, header: label, cell: (element: any) => `${element[label]}` }));
    return columns
  }
}

