import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';

const customerRouter: Routes = [
  {
    path: '', component: CustomerDetailsComponent
  }



]
@NgModule({
  declarations: [
    CustomerDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(customerRouter)
  ]
})
export class CustomerDetailsModule { }