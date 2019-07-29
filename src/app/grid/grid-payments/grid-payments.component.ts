import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../payments.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-grid-payments',
  templateUrl: './grid-payments.component.html',
  styleUrls: ['./grid-payments.component.css']
})
export class GridPaymentsComponent implements OnInit {
  subscription$ = new Subject();
  constructor(
    private paymentsService: PaymentsService,

  ) { }

  ngOnInit() {
    this.getKevaGlbData();
  }
  getKevaGlbData() {
    this.paymentsService.getKevaGlbData().pipe(takeUntil(this.subscription$)).subscribe(data => {
      this.paymentsService.globalData.next(data);
      console.log('GLOBAL DATA', data);
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
  }
}
