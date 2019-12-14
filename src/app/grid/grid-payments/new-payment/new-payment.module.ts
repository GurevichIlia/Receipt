import { NewPaymentComponent } from './new-payment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FirstStepComponent } from './first-step/first-step.component';
import { SecondStepComponent } from './second-step/second-step.component';
import { ThirdStepComponent } from './third-step/third-step.component';
import { FourthStepComponent } from './fourth-step/fourth-step.component';
import { FifthStepComponent } from './fifth-step/fifth-step.component';
import { BankComponent } from './third-step/bank/bank.component';
import { CreditCardComponent } from '../new-payment/third-step/credit-card/credit-card.component';
import { KevaRemarksComponent } from './keva-remarks/keva-remarks.component';
import { EditRemarkComponent } from './keva-remarks/edit-remark/edit-remark.component';

;

const newPaymentRoutes: Routes = [
  {
    path: '', component: NewPaymentComponent,
  },
]
@NgModule({
  declarations: [
    NewPaymentComponent,
    FirstStepComponent,
    SecondStepComponent,
    ThirdStepComponent,
    FourthStepComponent,
    FifthStepComponent,
    BankComponent,
    CreditCardComponent,
    KevaRemarksComponent,
    EditRemarkComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(newPaymentRoutes),
  ],
  entryComponents: [EditRemarkComponent]
})
export class NewPaymentModule { }
