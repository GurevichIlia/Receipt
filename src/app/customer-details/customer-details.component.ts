import { FullCustomerDetailsById, CustomerPhones } from './../models/fullCustomerDetailsById.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerDetailsService } from './customer-details.service';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  customerDetailsById$: Observable<FullCustomerDetailsById>;
  customerId: number;
  subscription$ = new Subject();
  propertis: ['work', 'trow'];
  displayWidth: number;
  constructor(
    private customerDetailsService: CustomerDetailsService,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) {

  }

  ngOnInit() {
    this.customerId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.customerDetailsService.setCustomerId(this.customerId);
    this.getCustomerDetailsByIdFromServer(this.customerId);

    this.getDisplayWidth();
    this.navigation();
  }
  ngAfterViewInit() {
    setTimeout(() => this.checkDisplayWidth(window.innerWidth), 1);

  }
  getCustomerDetailsByIdFromServer(customerId: number) {
    this.customerDetailsService.getCustomerDetailsById(customerId)
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((data: FullCustomerDetailsById) => {
        if (data) {
          console.log('CUSTOMER INFO', data);
          this.setCustomerDetailsByIdState(data);
          this.customerDetailsById$ = this.customerDetailsService.getCustomerDetailsByIdState$();
          // this.customerDetailsService.setCustomerInfoForNewReceipt(this.customerDetailsService.getCustomerDetailsByIdState());
        }
      })
  }
  setCustomerDetailsByIdState(customerDetailsById: FullCustomerDetailsById) {
    debugger
    this.customerDetailsService.setGlobalCustomerDetails(customerDetailsById);
    this.customerDetailsService.setCustomerDetailsByIdState(customerDetailsById);
  }
  closeSidenav() {
    this.sidenav.close();
  }
  openSidenav() {
    this.sidenav.open();
  }
  getDisplayWidth() {

    this.customerDetailsService.getDisplayWidth()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((data: number) => {

        this.checkDisplayWidth(data);
      })
  }

  checkDisplayWidth(width: number) {
    this.displayWidth = width;
    width < 765 ? this.sidenav.close() : this.sidenav.open();
  }

  getCurrentMenuItem() {
    return this.customerDetailsService.getCurrentMenuItem$();
  }

  navigateTo(route: string) {
    this.router.navigate([`home/customer-details/${this.customerId}/${route}`]);
  }

  navigation() {
    this.getCurrentMenuItem()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((data) => {
        data ? this.navigateTo(data.route) : null;
        console.log('ROUTE', data)
      }
      )
  }

  ngOnDestroy() {
    this.customerDetailsService.clearCurrentMenuItem();
    this.subscription$.next();
    this.subscription$.complete();
  }
}
