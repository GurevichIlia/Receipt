import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NewCustomerComponent } from './new-customer.component';

const newCustomerRoutes: Routes = [
  { path: '', component: NewCustomerComponent }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(newCustomerRoutes),
    CommonModule
  ],
  exports: [
    RouterModule,
  ]
})
export class NewCustomerRouterModule { }
