import { SendMessageModule } from './message/send-message.module';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTreeModule } from '@angular/material/tree';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';


import { AppRoutingModule } from './app-routing.module';

import { MomentModule } from 'ngx-moment';
import { CreditCardDirectivesModule } from 'angular-cc-library';

import { LoginComponent } from './login/login.component';


import { MaterialModule } from './material.module';
import { GeneralSrv } from './services/GeneralSrv.service';
import { AppComponent } from './app.component';
import { NewReceiptComponent } from './receipts/new-receipt/new-receipt.component';
import { TestCComponent } from './test-c/test-c.component';

import { CustomerInfoComponent } from './receipts/customer-info/customer-info.component';
import { ReceiptTypeComponent } from './receipts/receipt-type/receipt-type.component';
import { StoreComponent } from './receipts/store/store.component';
import { PaymentComponent } from './receipts/payment/payment.component';
import { CreditCardComponent } from './receipts/credit-card/credit-card.component';
import { ProccessRecieptComponent } from './receipts/proccess-reciept/proccess-reciept.component';
import { FilterProductsByCatPipe } from './myPipes/filter-products-by-cat.pipe';
import { KeysPipe } from './myPipes/keysPipe.pipe';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ServerErrorInterceptor } from './services/server-error-interceptor.service';
import { ModalSessionexpiredComponent } from './receipts/modals/modal-sessionexpired/modal-sessionexpired.component';
import { ModalFinalScreenComponent } from './receipts/modals/modal-final-screen/modal-final-screen.component';
import { ConfirmPurchasesComponent } from './receipts/modals/confirm-purchases/confirm-purchases.component';
import { SendMessageComponent } from './message/send-message/send-message.component';
import { TreeOfGroupsComponent } from './message/send-message/tree-of-groups/tree-of-groups.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { DisableControlDirective } from './shared/directives/disable-control.directive';
import { SharedModule } from './shared/shared.module';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NewReceiptComponent,
    TestCComponent,
    CustomerInfoComponent,
    ReceiptTypeComponent,
    StoreComponent,
    PaymentComponent,
    CreditCardComponent,
    ProccessRecieptComponent,
    FilterProductsByCatPipe,
    KeysPipe,
    ModalSessionexpiredComponent,
    ModalFinalScreenComponent,
    ConfirmPurchasesComponent,
    HeaderComponent,
    HomeComponentComponent,
    DisableControlDirective,
  ],
  imports: [
    ScrollingModule,
    BrowserModule,
    // FormsModule,
    // ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    MomentModule,
    // InfiniteScrollModule,
    CreditCardDirectivesModule,
    NgxPageScrollCoreModule,
    NgxPageScrollModule,
    // NgxMaskModule.forRoot({ showMaskTyped: true }),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    SharedModule,
    SendMessageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    
  ],
  // tslint:disable-next-line: max-line-length
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, GeneralSrv, { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }, ReceiptsService],
  bootstrap: [AppComponent],
  entryComponents: [CreditCardComponent, ModalFinalScreenComponent, ModalSessionexpiredComponent, ConfirmPurchasesComponent]

})
export class AppModule { }
