import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { StoreModule } from '@ngrx/store'

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';




import { MomentModule } from 'ngx-moment';
import { CreditCardDirectivesModule } from 'angular-cc-library';

import { LoginComponent } from './login/login.component';


import { MaterialModule } from './material.module';
import { GeneralSrv } from './receipts/services/GeneralSrv.service';
import { ReceiptsService } from 'src/app/receipts/services/receipts.service';
import { AppComponent } from './app.component';

import { CreditCardComponent } from './receipts/credit-card/credit-card.component';

import { KeysPipe } from './myPipes/keysPipe.pipe';
import { ToastrModule } from 'ngx-toastr';
import { IConfig } from 'ngx-mask';
import { ServerErrorInterceptor } from './receipts/services/server-error-interceptor.service';
import { ModalSessionexpiredComponent } from './receipts/modals/modal-sessionexpired/modal-sessionexpired.component';
import { ModalFinalScreenComponent } from './receipts/modals/modal-final-screen/modal-final-screen.component';
import { ConfirmPurchasesComponent } from './receipts/modals/confirm-purchases/confirm-purchases.component';

import { HeaderComponent } from './header/header.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { SharedModule } from './shared/shared.module';
import { appReducer } from './app.reducer';
import { PaymentsService } from './grid/payments.service';
import { FooterComponent } from './footer/footer.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    KeysPipe,
    ModalSessionexpiredComponent,
    HeaderComponent,
    HomeComponentComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,

    CreditCardDirectivesModule,
    StoreModule.forRoot({ auth: appReducer }),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added

    NgxUiLoaderModule, // import NgxUiLoaderModule
    NgxUiLoaderRouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  // tslint:disable-next-line: max-line-length
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [ModalSessionexpiredComponent]

})
export class AppModule { }
