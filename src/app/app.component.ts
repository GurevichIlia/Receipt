import { CustomerInfoService } from 'src/app/receipts/customer-info/customer-info.service';
import { GlobalStateService } from './shared/global-state-store/global-state.service';
import { GeneralSrv } from './receipts/services/GeneralSrv.service';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthenticationService } from './receipts/services/authentication.service';
import 'bootstrap/dist/css/bootstrap.css';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReceiptsService } from './receipts/services/receipts.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  subscription$ = new Subject();
  constructor(
    private receiptService: ReceiptsService,
    private authService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private generalService: GeneralSrv,
    private globalStateService: GlobalStateService,
    private customerInfoService: CustomerInfoService
  ) {
    // translate.setDefaultLang('en');
  }

  title = 'jaffaCrmAng';
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {

  //   if (this.receiptService.unsavedData) {
  //     $event.returnValue = true;
  //   }
  // }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.generalService.sizeOfWindow.next(event.currentTarget.innerWidth);
  }

  ngOnInit() {
    this.receiptService.currentReceiptLine$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(data => console.log('RECEIPT DATA CURRENT', data));

    this.checkAuthStatus();
    this.getCurrentAndPreviousRoutes()
  }

  checkAuthStatus() {
    this.authService.currentlyAuthStatus$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(isLogged => {
        console.log('CURRENT AUTH STATUS', isLogged);
          console.log('CUSTOMER INFO AFTER LOG OUT', this.globalStateService.customerDetailsById.getValue());
        


      })
  }

  getCurrentAndPreviousRoutes() {
    this.generalService.setCurrentRoute(this.router.url)
    this.router.events.
      pipe(
        filter((event: NavigationEnd) => event.url !== this.generalService.getCurrentRoute()),
        takeUntil(this.subscription$),

      )
      .subscribe(event => {//Вызывается два раза не знаю почему, поэтому фильтрую
        if (event instanceof NavigationEnd) {
          this.generalService.setPreviousRoute(this.generalService.getCurrentRoute())
          this.generalService.setCurrentRoute(event.url);
          console.log('ROUTE CURRENT', event);
          // Проверяем если мы после заполнения формы с информацией переходим не на роут с созданием Кева,
          // тогда стираем стейт с данными в сервисе для компонента CustomerInfoComponent.
          // если на создание Кева, то оставляем стейт до завершения создания Кева.
          if (this.generalService.getPreviousRoute() === '/payments-grid/customer-search' && this.generalService.getCurrentRoute() !== '/payments-grid/new-payment' ||
            this.generalService.getCurrentRoute() !== '/payments-grid/customer-search' && this.generalService.getPreviousRoute() === '/payments-grid/new-payment'
          ) {
            this.customerInfoService.clearCurrentCustomerInfoByIdForCustomerInfoComponent();

          } else {
            console.log('NOT CLEAR')
          }
        }

      })
  }

  ngOnDestroy() {
    this.authService.refreshFullState();
    this.receiptService.refreshNewReceipt();
    this.subscription$.next();
    this.subscription$.complete();
  }
}
