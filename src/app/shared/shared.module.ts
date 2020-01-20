import { ChargeIdEditModalComponent } from './../grid/grid-payments/payments-history/charges-byChargeId-modal/charge-id-edit-modal/charge-id-edit-modal.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './../material.module';
import { CustomerInfoComponent } from '..//shared/share-components/customer-info/customer-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerPaymentsComponent } from '../receipts/payments-list/customer-payments/customer-payments.component';
import { PaymentsListComponent } from '../receipts/payments-list/payments-list.component';
import { MomentModule } from 'ngx-moment';
import { ReceiptTypeFilterPipe } from './pipes/receipt-type-filter.pipe';
import { TableComponent } from './share-components/table/table.component';
import { SendByEmailComponent } from './modals/send-by-email/send-by-email.component';
import { SearchComponent } from './share-components/search/search.component';
import { CustomerInfoViewComponent } from '../shared/share-components/customer-info/customer-info-view/customer-info-view.component';
import { CreditCardComponent } from 'src/app/receipts/credit-card/credit-card.component';
import { SuggestExistingCustomerComponent } from './modals/suggest-existing-customer/suggest-existing-customer.component';
import { AskQuestionComponent } from './modals/ask-question/ask-question.component';
import { DateTransformPipe } from './pipes/date-transform.pipe';
import { ModalSessionexpiredComponent } from './modals/modal-sessionexpired/modal-sessionexpired.component';
import { ConfirmPurchasesComponent } from './modals/confirm-purchases/confirm-purchases.component';
import { AutocompleteComponent } from './share-components/autocomplete/autocomplete.component';
import { HighlightErrorIfInvalidDirective } from './directives/highlight-error-if-invalid.directive';
import { CustomerGroupsComponent } from './modals/customer-groups/customer-groups.component';
import { TreeOfGroupsComponent } from './share-components/tree-of-groups/tree-of-groups.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomerGroupsContainerComponent } from './share-components/customer-groups-container/customer-groups-container.component';
import { CustomerGroupsViewComponent } from './share-components/customer-groups-container/customer-groups-view/customer-groups-view.component';
import { ExistingCustomersListComponent } from './modals/existing-customers-list/existing-customers-list.component';
import { PaymentsTableComponent } from '../grid/grid-payments/payments-table/payments-table.component';
import { PaymentsTableHeaderComponent } from '../grid/grid-payments/payments-table-header/payments-table-header.component';
import { PaymentsFilterComponent } from '../grid/grid-payments/payments-table-header/payments-filter/payments-filter.component';
import { ChargesByChargeIdComponent } from '../grid/grid-payments/payments-history/charges-byChargeId-modal/charges-by-charge-id.component';
import { DialogComponent } from './modals/dialog/dialog.component';
import { ItemsListComponent } from './share-components/items-list/items-list.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


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
            HighlightErrorIfInvalidDirective,
            CustomerGroupsComponent,
            TreeOfGroupsComponent,
            CustomerGroupsContainerComponent,
            CustomerGroupsViewComponent,
            ExistingCustomersListComponent,
            PaymentsTableComponent,
            PaymentsTableHeaderComponent,
            PaymentsFilterComponent,
            ChargesByChargeIdComponent,
            ChargeIdEditModalComponent,
            DialogComponent,
            ItemsListComponent,




      ],
      imports: [
            CommonModule,
            TranslateModule,
            MaterialModule,
            FormsModule,
            ReactiveFormsModule,
            MomentModule,
            InfiniteScrollModule,
            OwlDateTimeModule, 
            OwlNativeDateTimeModule,



      ],
      exports: [
            ReactiveFormsModule,
            FormsModule,
            MaterialModule,
            TranslateModule,
            MomentModule,
            OwlDateTimeModule, 
            OwlNativeDateTimeModule,
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
            TreeOfGroupsComponent,
            CustomerGroupsContainerComponent,
            PaymentsTableComponent,
            PaymentsTableHeaderComponent,
            PaymentsFilterComponent,
            ChargesByChargeIdComponent,
            ChargeIdEditModalComponent,
            DialogComponent,
            ItemsListComponent,
            CustomerGroupsViewComponent





      ],
      entryComponents: [
            CreditCardComponent,
            SendByEmailComponent,
            SuggestExistingCustomerComponent,
            AskQuestionComponent,
            ModalSessionexpiredComponent,
            ConfirmPurchasesComponent,
            CustomerGroupsComponent,
            ExistingCustomersListComponent,
            PaymentsTableComponent,
            PaymentsTableHeaderComponent,
            PaymentsFilterComponent,
            ChargesByChargeIdComponent,
            ChargeIdEditModalComponent,
            DialogComponent,
            CustomerGroupsViewComponent



      ]
})
export class SharedModule {

}