import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewCustomerComponent } from './new-customer.component';
import { NewCustomerRouterModule } from './new-customer-router.module';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
console.log('NEW CUSTOMER LOADED')

// const newCustomerRoutes: Routes = [
//   { path: '', component: NewCustomerComponent }
// ]

@NgModule({
  declarations: [NewCustomerComponent],
  imports: [
    NewCustomerRouterModule,
    SharedModule,
    CommonModule,
    // RouterModule.forChild(newCustomerRoutes),

  ],
  exports: [
  ]
})

export class NewCustomerModule {

}
