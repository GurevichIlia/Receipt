import { CreditCardComponent } from 'src/app/receipts/credit-card/credit-card.component';
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
import { MomentModule } from 'ngx-moment';
import { ReceiptTypeFilterPipe } from './pipes/receipt-type-filter.pipe';
import { TableComponent } from './share-components/table/table.component';

@NgModule({
      declarations: [
            CustomerInfoComponent,
            PaymentsListComponent,
            CustomerPaymentsComponent,
            CreditCardComponent,
            ReceiptTypeFilterPipe,
            TableComponent,
      ],
      imports: [
            CommonModule,
            TranslateModule,
            MaterialModule,
            FormsModule,
            ReactiveFormsModule,
            NgxPageScrollCoreModule,
            NgxPageScrollModule,
            MomentModule,
      ],
      exports: [
            ReactiveFormsModule,
            FormsModule,
            MaterialModule,
            CustomerInfoComponent,
            TranslateModule,
            MomentModule,
            NgxPageScrollCoreModule,
            NgxPageScrollModule,
            PaymentsListComponent,
            CustomerPaymentsComponent,
            ReceiptTypeFilterPipe,
            TableComponent
         
      ],
      entryComponents:[CreditCardComponent]
})
export class SharedModule {

}