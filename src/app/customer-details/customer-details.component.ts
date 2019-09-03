import { FullCustomerDetailsById } from './../models/fullCustomerDetailsById.model';
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
    this.getCustomerDetailsById(this.customerId);
    this.getDisplayWidth();

  }
  ngAfterViewInit() {
    setTimeout(() => this.checkDisplayWidth(window.innerWidth), 1);

  }
  getCustomerDetailsById(customerId: number) {
    this.customerDetailsService.getCustomerDetailsById(customerId)
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(data => {
        console.log('CUSTOMER INFO', data)
        this.customerDetailsService.setCustomerDetailsByIdState({ ...data });
        this.customerDetailsById$ = this.customerDetailsService.getCustomerDetailsByIdState$();
      })
    console.log('PROPERTIS', this.propertis)
  }
  navigation(route: string) {
    this.router.navigate([`home/customer-details/${this.customerId}/${route}`]);
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
  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
  checkDisplayWidth(width: number) {
    this.displayWidth = width;
    width < 765 ? this.sidenav.close() : this.sidenav.open();

  }
}
