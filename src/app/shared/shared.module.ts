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
import { SuggestExistingCustomerComponent } from './modals/suggest-existing-customer/suggest-existing-customer.component';
import { AskQuestionComponent } from './modals/ask-question/ask-question.component';
import { DateTransformPipe } from './pipes/date-transform.pipe';
import { ModalSessionexpiredComponent } from '../receipts/modals/modal-sessionexpired/modal-sessionexpired.component';
import { ConfirmPurchasesComponent } from '../receipts/modals/confirm-purchases/confirm-purchases.component';
import { AutocompleteComponent } from './share-components/autocomplete/autocomplete.component';
import { HighlightErrorIfInvalidDirective } from './directives/highlight-error-if-invalid.directive';


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
            SuggestExistingCustomerComponent,
            AskQuestionComponent,
            DateTransformPipe,
            ConfirmPurchasesComponent,
            ModalSessionexpiredComponent,
            AutocompleteComponent,
            HighlightErrorIfInvalidDirective

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
            TranslateModule,
            MomentModule,
            NgxPageScrollCoreModule,
            NgxPageScrollModule,
            PaymentsListComponent,
            CustomerPaymentsComponent,
            ReceiptTypeFilterPipe,
            TableComponent,
            SearchComponent,
            CustomerInfoComponent,
            CustomerInfoViewComponent,
            DateTransformPipe,
            HighlightErrorIfInvalidDirective,
            AutocompleteComponent,


      ],
      entryComponents: [CreditCardComponent, SendByEmailComponent, SuggestExistingCustomerComponent, AskQuestionComponent, ModalSessionexpiredComponent, ConfirmPurchasesComponent]
})
export class SharedModule {

}