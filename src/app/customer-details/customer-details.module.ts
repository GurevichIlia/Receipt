import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { PaymentsComponent } from './payments/payments.component';

const customerRouter: Routes = [
  {
    path: '', component: CustomerDetailsComponent, children: [
      { path: 'payments', component: PaymentsComponent },
      { path: 'main-info', loadChildren: './main-info/main-info.module#MainInfoModule' },
      { path: 'receipts', loadChildren: './receipts/receipts.module#ReceiptsModule' }
    ]
  }
];
@NgModule({
  declarations: [
    CustomerDetailsComponent,
    SideMenuComponent,
    PaymentsComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(customerRouter)
  ]
})
export class CustomerDetailsModule { }