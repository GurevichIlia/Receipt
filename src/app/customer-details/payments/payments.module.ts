import { PaymentsComponent } from './payments.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const paymentsRoutes: Routes = [
  {
    path: '', children: [
      { path: 'receipts', loadChildren: '../payments/receipts/receipts.module#ReceiptsModule' },
      { path: 'kevas', loadChildren: '../payments/kevas/kevas.module#KevasModule' },
 
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
