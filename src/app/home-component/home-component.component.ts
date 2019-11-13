import { CustomerInfoService } from 'src/app/receipts/customer-info/customer-info.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneralSrv } from '../receipts/services/GeneralSrv.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit, OnDestroy {
  subscription$ = new Subject();
  constructor(
    private generalService: GeneralSrv,
    private router: Router,
    private customerInfoService: CustomerInfoService
  ) { }

  ngOnInit() {
    this.getGlobalData();
    this.getCities();
    this.getCurrentAndPreviousRoutes();
  }

  getGlobalData() {
    this.generalService.getKevaGlbData(this.generalService.getOrgName())
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(data => this.generalService.setGlobalDataState(data));
  }

  getCities() {
    if (this.generalService.checkLocalStorage('cities')) {
      const cities = JSON.parse(this.generalService.checkLocalStorage('cities'));
      this.generalService.setCities(cities)
    } else {
      this.generalService.GetSystemTables()
        .pipe(
          takeUntil(this.subscription$))
        .subscribe(
          response => {
            console.log('LoadSystemTables', response);
            if (response.IsError == true) {
              alert('err');
            } else {
              const cities = response.Cities;
              this.generalService.setCities(cities)
              localStorage.setItem('cities', JSON.stringify(cities))
              console.log('CITIES', cities)
            }
          },
          error => {
            console.log(error);
          },
          () => {
            console.log('CallCompleted');
          }
        );
    }

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
          if (this.generalService.getPreviousRoute() === '/home/payments-grid/customer-search' && this.generalService.getCurrentRoute() !== '/home/payments-grid/new-payment' ||
          this.generalService.getCurrentRoute() !== '/home/payments-grid/customer-search' && this.generalService.getPreviousRoute() === '/home/payments-grid/new-payment'
          ) {
            this.customerInfoService.clearCurrentCustomerInfoByIdForCustomerInfoComponent();

          } else {
            console.log('NOT CLEAR')
          }
        }

      })
  }

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
