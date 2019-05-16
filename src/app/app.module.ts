import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MomentModule } from 'ngx-moment';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LoginComponent } from './login/login.component';
// import {
//   MatInputModule,
//   MatFormFieldModule,
//   MatCardModule
// } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { GeneralSrv } from './services/GeneralSrv.service';

import { NewReceiptComponent } from './receipts/new-receipt/new-receipt.component';
import * as moment from 'moment';
import { TestCComponent } from './test-c/test-c.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomerInfoComponent } from './receipts/customer-info/customer-info.component';
import { ReceiptTypeComponent } from './receipts/receipt-type/receipt-type.component';
import { StoreComponent } from './receipts/store/store.component';
import { PaymentComponent } from './receipts/payment/payment.component';
import { CreditCardComponent } from './receipts/credit-card/credit-card.component';
import { ProccessRecieptComponent } from './receipts/proccess-reciept/proccess-reciept.component';
import { FilterProductsByCatPipe } from './myPipes/filter-products-by-cat.pipe';
import { MAT_DATE_LOCALE } from '@angular/material';
import { KeysPipe } from './myPipes/keysPipe.pipe';


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
    KeysPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    MomentModule,
    CreditCardDirectivesModule
    // MatInputModule,
    // MatFormFieldModule,
    // MatCardModule
    // MatButtonModule,
    // MatCheckboxModule
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'} ,GeneralSrv],
  bootstrap: [AppComponent],
  entryComponents: [CreditCardComponent]
  
})
export class AppModule { }
