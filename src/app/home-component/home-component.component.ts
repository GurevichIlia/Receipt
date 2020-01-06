import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit, OnDestroy {
  subscription$ = new Subject();
  constructor(
    // private generalService: GeneralSrv,
    // private router: Router,
    // private customerInfoService: CustomerInfoService,
    // private globalStateService: GlobalStateService,
    // private customerGroupsService: CustomerGroupsService,
    // private globalEventsService: GlobalEventsService
  ) {
  }

  ngOnInit() {
    // this.getGlobalData();
    // this.getCities();
  
    // this.GetCustomerSearchData();
    // this.isUpdateCustomerSearchData();
  }

  // getGlobalData() {
  //   this.generalService.getKevaGlbData(this.generalService.getOrgName())
  //     .pipe(
  //       takeUntil(this.subscription$))
  //     .subscribe(data => this.generalService.setGlobalDataState(data));
  // }

  // getCities() {
  //   // if (this.generalService.checkLocalStorage('cities')) {
  //   //   const cities = JSON.parse(this.generalService.checkLocalStorage('cities'));
  //   //   this.generalService.setCities(cities)
  //   // } else {
  //   this.generalService.GetSystemTables()
  //     .pipe(
  //       takeUntil(this.subscription$))
  //     .subscribe(
  //       response => {
  //         console.log('LoadSystemTables', response);
  //         if (response['IsError'] == true) {
  //           alert('err');
  //         } else {
  //           const cities = response.Cities;
  //           const generalGroups = [...response.CustomerGroupsGeneral]
  //           this.generalService.setCities(cities);
  //           this.customerGroupsService.setCustomerGroups(generalGroups);
  //           localStorage.setItem('cities', JSON.stringify(cities))
  //           console.log('CITIES', cities)
  //         }
  //       },
  //       error => {
  //         console.log(error);
  //       },
  //       () => {
  //         console.log('CallCompleted');
  //       }
  //     );
  //   // }

  // }



  // GetCustomerSearchData() {
  //   let customerList: CustomerSearchData[] = [];
  //   if (this.generalService.checkLocalStorage('customerSearchData')) {
  //     customerList = JSON.parse(this.generalService.checkLocalStorage('customerSearchData'))
  //     this.globalStateService.setCustomerList(customerList);
  //   } else {
  //     this.generalService.getUsers()
  //       .pipe(
  //         map(response => {
  //           if (response.length === 0) {
  //             // this.authService.logout();
  //             return response;
  //           } else {
  //             return response;
  //           }
  //         }),
  //         // map(response => response)

  //         takeUntil(this.subscription$))
  //       .subscribe(
  //         data => {
  //           customerList = data;
  //           customerList = customerList.filter(data => String(data['FileAs1']) != ' ');
  //           this.globalStateService.setCustomerList(customerList)
  //           localStorage.setItem('customerSearchData', JSON.stringify(customerList));
  //           console.log('this.AllCustomerTables', customerList);
  //         },
  //       );

  //   }
  // }

  // isUpdateCustomerSearchData() {
  //   this.globalEventsService.getIsUpdateCustomerSearchData$()
  //     .pipe(
  //       takeUntil(this.subscription$))
  //     .subscribe((isUpdate: boolean) => {
  //       if (isUpdate) {
  //         this.GetCustomerSearchData();
  //       }
  //     })

  // }


  checkAuthStatus() {

  }
  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
