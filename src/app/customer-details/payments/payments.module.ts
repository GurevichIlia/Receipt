import { PaymentsComponent } from './payments.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const paymentsRoutes: Routes = [
  {
    path: '', children: [
      { path: 'receipts', loadChildren: '../receipts/receipts.module#ReceiptsModule' }
    ]
  }
]

@NgModule({
  declarations: [PaymentsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(paymentsRoutes)
  ]
})
export class PaymentsModule { }
