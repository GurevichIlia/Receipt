import { FullCustomerDetailsById } from './../models/fullCustomerDetailsById.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerDetailsService } from './customer-details.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  customerDetailsById$: Observable<FullCustomerDetailsById>;
  customerId: number;
  subscription$ = new Subject();
  propertis: ['work', 'trow']
  constructor(
    private customerDetailsService: CustomerDetailsService,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit() {
    this.customerId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.getCustomerDetailsById(this.customerId);
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
  test() {
    this.customerId = 1952
    this.router.navigate([`home/customer-details/${1952}/main-info`]);
    this.getCustomerDetailsById(1952);
  }
  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
