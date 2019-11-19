import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';

import { GridPaymentsComponent } from './grid-payments/grid-payments.component';
import { PaymentsTableComponent } from './grid-payments/payments-table/payments-table.component';
import { CustomerSearchComponent } from './grid-payments/customer-search/customer-search.component';
import { PaymentsFilterComponent } from './grid-payments/payments-table-header/payments-filter/payments-filter.component';

import { PaymentsTableHeaderComponent } from './grid-payments/payments-table-header/payments-table-header.component';
import { PaymentsHistoryComponent } from './grid-payments/payments-history/payments-history.component';
import { PaymentsTableViewComponent } from './grid-payments/payments-history/payments-table-view/payments-table-view.component';
import { ChargesByChargeIdComponent } from './grid-payments/payments-history/charges-byChargeId-modal/charges-by-charge-id.component';
import { ChargeIdEditModalComponent } from './grid-payments/payments-history/charges-byChargeId-modal/charge-id-edit-modal/charge-id-edit-modal.component';

const gridRouter: Routes = [
  {
    path: '', component: GridPaymentsComponent, children: [
      { path: '', redirectTo: 'payments' },
      { path: 'customer-search', component: CustomerSearchComponent },
      { path: 'new-payment', loadChildren: './grid-payments/new-payment/new-payment.module#NewPaymentModule'},
      { path: 'payments', component: PaymentsTableComponent },
      { path: 'keva-charges', component: PaymentsHistoryComponent },
    ]
  }


]
@NgModule({
  declarations: [
    GridPaymentsComponent,
    PaymentsTableComponent,
    CustomerSearchComponent,
    // NewPaymentComponent,
    PaymentsFilterComponent,
    // FirstStepComponent,
    // SecondStepComponent,
    // ThirdStepComponent,
    // FourthStepComponent,
    // FifthStepComponent,
    // BankComponent,
    // CreditCardComponent,
    PaymentsTableHeaderComponent,
    PaymentsHistoryComponent,
    PaymentsTableViewComponent,
    ChargesByChargeIdComponent,
    ChargeIdEditModalComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(gridRouter),
  ],
  exports: [
  ],
  providers: [],
  entryComponents: [ChargesByChargeIdComponent, ChargeIdEditModalComponent]

})
export class GridModule { }
