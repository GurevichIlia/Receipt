import { CustomerGroupsService } from './../core/services/customer-groups.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomerSearchData } from 'src/app/receipts/services/GeneralSrv.service';
import { GlobalStateService } from './../shared/global-state-store/global-state.service';
import { FullCustomerDetailsById, CustomerPhones } from './../models/fullCustomerDetailsById.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerDetailsService } from './customer-details.service';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, switchMap, filter, map, tap } from 'rxjs/operators';
import { MatSidenav } from '@angular/material';
import { FormControl } from '@angular/forms';
import { GeneralGroups } from '../models/generalGroups.model';

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

  searchControl = new FormControl();
  filteredOptions$: Observable<CustomerSearchData[]>;

  customerIsExist = false;
  customerSearchList$: Observable<CustomerSearchData[]>;
  generalGroups: GeneralGroups[] = [];
  constructor(
    private customerDetailsService: CustomerDetailsService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private loader: NgxUiLoaderService,
    private customerGroupsService: CustomerGroupsService

  ) {

  }

  ngOnInit() {
    this.customerId = 1952;
    this.getCustomerSearchData();

    this.customerDetailsService.setCustomerId(this.customerId);
    this.getCustomerDetailsByIdFromServer();
    this.getDisplayWidth();
    this.navigation();
    this.checkIfUpdateCustomerInfoWasClicked();
    console.log('MAY SIDE NAV', this.sidenav);
  }

  ngAfterViewInit() {
    setTimeout(() => this.checkDisplayWidth(window.innerWidth), 1);

  }

  getCustomerId() {
    return this.customerDetailsService.getCustomerId$();
  }

  createCustomerDetailsStream$() {
    const customerDetails$ = this.getCustomerId()
      .pipe(
        // filter(customerId => customerId ? customerId :  ),
        switchMap(customerId => {
          return this.customerDetailsService.getCustomerDetailsById(customerId)
        }))
    return customerDetails$;
  }

  getCustomerDetailsByIdFromServer() {
    this.createCustomerDetailsStream$()
      .pipe(

        takeUntil(this.subscription$))
      .subscribe((data: FullCustomerDetailsById) => {
        if (data) {
          console.log('CUSTOMER INFO FROM THE SERVER', data);
          this.setCustomerDetailsByIdState({ ...data });
          this.customerDetailsById$ = this.customerDetailsService.getCustomerDetailsByIdState$();
          this.customerGroupsService.clearSelectedGroups();
          this.customerGroupsService.setAlreadySelectedGroupsFromCustomerInfo(data.CustomerGroupsGeneralSet.map(group => group.CustomerGeneralGroupId))
          // this.customerDetailsService.setCustomerInfoForNewReceipt(this.customerDetailsService.getCustomerDetailsByIdState());
        }
        this.loader.stop();
      },
        error => {
          console.log(error);
          this.loader.stop();
        })
  }



  setCustomerDetailsByIdState(customerDetailsById: FullCustomerDetailsById) {
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
    width < 1024 ? this.sidenav.close() : this.sidenav.open();
  }

  getCurrentMenuItem() {
    return this.customerDetailsService.getCurrentMenuItem$();
  }

  navigateTo(route: string) {
    this.router.navigate([`customer-details/customer/${route}`]);
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

  setCustomerId(customerId: number) {
    this.loader.start();
    this.customerDetailsService.setCustomerId(customerId);
  }

  checkIfUpdateCustomerInfoWasClicked() {
    this.customerDetailsService.updateCustomerInfo$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((updateClicked: boolean) => {

        if (updateClicked) {
          this.getCustomerDetailsByIdFromServer();
        }
      })
  }


  getCustomerSearchData() {
    this.globalStateService.getCustomerSearchList$()
      .pipe(
        map((searchData: CustomerSearchData[]) => searchData.filter(data => String(data['FileAs1']) != ' ')),
        takeUntil(this.subscription$))
      .subscribe((searchData: CustomerSearchData[]) => {
        // if (!this.globalStateService.customerSearchList.getValue()) {
        //   this.globalStateService.setCustomerSearchList(searchData)
        // }
        this.customerSearchList$ = of(searchData);
        this.filteredOptions$ = this.customerDetailsService.customerListAutocomplete(this.searchControl, this.customerSearchList$);

      }, err => console.log(err))

  }
  ngOnDestroy() {
    this.customerDetailsService.clearCurrentMenuItem();
    this.customerGroupsService.clearSelectedGroups();
    this.subscription$.next();
    this.subscription$.complete();
  }
}
