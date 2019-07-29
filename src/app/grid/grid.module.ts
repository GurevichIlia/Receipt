import { SharedModule } from './../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsService } from './payments.service';
import { GridPaymentsComponent } from './grid-payments/grid-payments.component';
import { PaymentsTableComponent } from './grid-payments/payments-table/payments-table.component';
import { CustomerDetailsComponent } from './grid-payments/customer-details/customer-details.component';
import { CustomerSearchComponent } from './grid-payments/customer-search/customer-search.component';
import { NewPaymentComponent } from './grid-payments/new-payment/new-payment.component';
import { PaymentsFilterComponent } from './grid-payments/payments-filter/payments-filter.component';
import { FirstStepComponent } from './grid-payments/new-payment/first-step/first-step.component';
import { SecondStepComponent } from './grid-payments/new-payment/second-step/second-step.component';
import { ThirdStepComponent } from './grid-payments/new-payment/third-step/third-step.component';
import { FourthStepComponent } from './grid-payments/new-payment/fourth-step/fourth-step.component';
import { FifthStepComponent } from './grid-payments/new-payment/fifth-step/fifth-step.component';
import { BankComponent } from './grid-payments/new-payment/third-step/bank/bank.component';
import { CreditCardComponent } from './grid-payments/new-payment/third-step/credit-card/credit-card.component';


const gridRouter: Routes = [
  { path: '', component: GridPaymentsComponent },
  { path: 'customer-details', component: CustomerDetailsComponent },
  { path: 'customer-search', component: CustomerSearchComponent },
  { path: 'new-payment', component: NewPaymentComponent },
]


@NgModule({
  declarations: [GridPaymentsComponent, PaymentsTableComponent, CustomerDetailsComponent, CustomerSearchComponent, NewPaymentComponent, PaymentsFilterComponent, FirstStepComponent, SecondStepComponent, ThirdStepComponent, FourthStepComponent, FifthStepComponent, BankComponent, CreditCardComponent],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(gridRouter),
  ],
  exports: [
  ],
  providers: [PaymentsService]

})
export class GridModule { }