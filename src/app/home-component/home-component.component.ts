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
  }
  getGlobalData() {
    this.generalService.getKevaGlbData(this.generalService.getOrgName()).pipe(takeUntil(this.subscription$)).subscribe(data => this.generalService.setGlobalDataState(data));
  }
  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
