import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';

import { GridPaymentsComponent } from './grid-payments/grid-payments.component';
import { PaymentsTableComponent } from './grid-payments/payments-table/payments-table.component';
import { CustomerSearchComponent } from './grid-payments/customer-search/customer-search.component';

import { PaymentsHistoryComponent } from './grid-payments/payments-history/payments-history.component';
import { PaymentsTableViewComponent } from './grid-payments/payments-history/payments-table-view/payments-table-view.component';
import { ChargeIdEditModalComponent } from './grid-payments/payments-history/charges-byChargeId-modal/charge-id-edit-modal/charge-id-edit-modal.component';
import { PaymentTableContainerComponent } from './grid-payments/payment-table-container/payment-table-container.component';

const gridRouter: Routes = [
  {
    path: '', component: GridPaymentsComponent, children: [
      { path: '', redirectTo: 'payments' },
      { path: 'customer-search', component: CustomerSearchComponent },
      { path: 'new-payment', loadChildren: './grid-payments/new-payment/new-payment.module#NewPaymentModule' },
      { path: 'edit', loadChildren: './grid-payments/new-payment/new-payment.module#NewPaymentModule' },
      { path: 'duplicate', loadChildren: './grid-payments/new-payment/new-payment.module#NewPaymentModule' },
      { path: 'payments', component: PaymentTableContainerComponent },
      { path: 'keva-charges', component: PaymentsHistoryComponent },
    ]
  }


]
@NgModule({
  declarations: [
    GridPaymentsComponent,

    CustomerSearchComponent,
    // NewPaymentComponent,
    // FirstStepComponent,
    // SecondStepComponent,
    // ThirdStepComponent,
    // FourthStepComponent,
    // FifthStepComponent,
    // BankComponent,
    // CreditCardComponent,
    PaymentsHistoryComponent,
    PaymentsTableViewComponent,
    PaymentTableContainerComponent,
    
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(gridRouter),
  ],
  exports: [
  ],
  providers: [],
  entryComponents: []

})
export class GridModule { }
