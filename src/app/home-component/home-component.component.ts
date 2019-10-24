import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneralSrv } from '../receipts/services/GeneralSrv.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit, OnDestroy {
  subscription$ = new Subject();
  constructor(
    private generalService: GeneralSrv
  ) { }

  ngOnInit() {
    this.getGlobalData();
    this.getCities(); 
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

  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
