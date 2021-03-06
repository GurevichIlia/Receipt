import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


import { SharedModule } from '../shared/shared.module';
import { NewReceiptComponent } from './new-receipt/new-receipt.component';
import { TestCComponent } from '../test-c/test-c.component';
import { ReceiptTypeComponent } from './receipt-type/receipt-type.component';
import { StoreComponent } from './store/store.component';
import { PaymentComponent } from './payment/payment.component';
import { ProccessRecieptComponent } from './proccess-reciept/proccess-reciept.component';
import { DisableControlDirective } from '../shared/directives/disable-control.directive';
import { FilterProductsByCatPipe } from '../myPipes/filter-products-by-cat.pipe';
import { ModalFinalScreenComponent } from '../shared/modals/modal-final-screen/modal-final-screen.component';

const receiptRoutes: Routes = [
      { path: '', component: NewReceiptComponent }
]


@NgModule({
      declarations: [
            NewReceiptComponent,
            TestCComponent,
            ReceiptTypeComponent,
            StoreComponent,
            PaymentComponent,
            ProccessRecieptComponent,
            ModalFinalScreenComponent,
            DisableControlDirective,
            FilterProductsByCatPipe,
                  ],
      imports: [
            CommonModule,
            SharedModule,
            RouterModule.forChild(receiptRoutes)
      ],
      exports: [
            RouterModule
      ],
      providers: [],
      entryComponents: [ModalFinalScreenComponent,
            ]
})



export class ReceiptModule { }