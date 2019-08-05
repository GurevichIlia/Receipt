import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './../material.module';
import { CustomerInfoComponent } from '../receipts/customer-info/customer-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { CustomerPaymentsComponent } from '../receipts/payments-list/customer-payments/customer-payments.component';
import { PaymentsListComponent } from '../receipts/payments-list/payments-list.component';

@NgModule({
      declarations: [
            CustomerInfoComponent,
            PaymentsListComponent,
            CustomerPaymentsComponent
      ],
      imports: [
            CommonModule,
            TranslateModule,
            MaterialModule,
            FormsModule,
            ReactiveFormsModule,
            NgxPageScrollCoreModule,
            NgxPageScrollModule,
      ],
      exports: [
            ReactiveFormsModule,
            FormsModule,
            MaterialModule,
            CustomerInfoComponent,
            TranslateModule,
            NgxPageScrollCoreModule,
            NgxPageScrollModule,
            PaymentsListComponent,
            CustomerPaymentsComponent
      ]
})
export class SharedModule {

}