import { SharedModule } from './../shared/shared.module';
import {  RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridService } from './grid.service';
import { GridPaymentsComponent } from './grid-payments/grid-payments.component';
import { AgGridModule } from 'ag-grid-angular';
import { GridTableComponent } from './grid-payments/grid-table/grid-table.component';
import { CustomerDetailsComponent } from './grid-payments/customer-details/customer-details.component';


const gridRouter: Routes = [
  { path: '', component: GridPaymentsComponent },
  { path: 'customer-details', component: CustomerDetailsComponent },
]


@NgModule({
  declarations: [GridPaymentsComponent, GridTableComponent, CustomerDetailsComponent],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(gridRouter),
  ],
  exports: [
  ],
  providers: [GridService]

})
export class GridModule { }
