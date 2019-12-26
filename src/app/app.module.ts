import { GlobalStateService } from './shared/global-state-store/global-state.service';
import { AuthenticationService } from 'src/app/receipts/services/authentication.service';
import { LoginModule } from './login/login.module';
import { NewCustomerModule } from './new-customer/new-customer.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';


import { CreditCardDirectivesModule } from 'angular-cc-library';
import { AppComponent } from './app.component';


import { KeysPipe } from './myPipes/keysPipe.pipe';
import { ToastrModule } from 'ngx-toastr';
import { ServerErrorInterceptor } from './receipts/services/server-error-interceptor.service';
import { ModalSessionexpiredComponent } from './receipts/modals/modal-sessionexpired/modal-sessionexpired.component';


import { HeaderComponent } from './header/header.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { SharedModule } from './shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { TokenInterceptorService } from './receipts/services/token-interceptor.service';
import { ConfirmPurchasesComponent } from './receipts/modals/confirm-purchases/confirm-purchases.component';
import { NgxMaskModule } from 'ngx-mask'


// export let options: Partial<IConfig> | (() => Partial<IConfig>);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    // LoginComponent,
    KeysPipe,
    HeaderComponent,
    HomeComponentComponent,
    FooterComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    CreditCardDirectivesModule,
    // required animations module
    ToastrModule.forRoot(), // ToastrModule added

    NgxUiLoaderModule, // import NgxUiLoaderModule
    NgxUiLoaderRouterModule,
    LoginModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  // tslint:disable-next-line: max-line-length
  providers: [AuthenticationService, GlobalStateService, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true, }, { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: []

})
export class AppModule { }
