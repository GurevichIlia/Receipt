import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { ServerErrorInterceptor } from './shared/services/server-error-interceptor.service';


import { HeaderComponent } from './header/header.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { SharedModule } from './shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { TokenInterceptorService } from './shared/services/token-interceptor.service';
import { NgxMaskModule } from 'ngx-mask'
import { GeneralSrv } from './shared/services/GeneralSrv.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { GlobalStateService } from './shared/global-state-store/global-state.service';
import { ReceiptsService } from 'src/app/shared/services/receipts.service';

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  // tslint:disable-next-line: max-line-length
  providers: [
    GeneralSrv,
    GlobalStateService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: []

})
export class AppModule { }
