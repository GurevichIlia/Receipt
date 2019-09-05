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
import { SendByEmailComponent } from './modals/send-by-email/send-by-email.component';
import { SearchComponent } from '../grid/grid-payments/customer-search/search/search.component';
import { CustomerInfoViewComponent } from '../receipts/customer-info/customer-info-view/customer-info-view.component';
import { CreditCardComponent } from 'src/app/receipts/credit-card/credit-card.component';


@NgModule({
      declarations: [
            CustomerInfoComponent,
            CustomerInfoViewComponent,
            PaymentsListComponent,
            CustomerPaymentsComponent,
            CreditCardComponent,
            ReceiptTypeFilterPipe,
            TableComponent,
            SendByEmailComponent,
            SearchComponent,
           
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
            TableComponent,
            SearchComponent,
            CustomerInfoViewComponent
         
      ],
      entryComponents:[CreditCardComponent,SendByEmailComponent]
})
export class SharedModule {

}