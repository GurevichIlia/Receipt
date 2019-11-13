import { GeneralSrv } from './receipts/services/GeneralSrv.service';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthenticationService } from './receipts/services/authentication.service';
import 'bootstrap/dist/css/bootstrap.css';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReceiptsService } from './receipts/services/receipts.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    private generalService: GeneralSrv
  ) {
    translate.setDefaultLang('en');

  }

  title = 'jaffaCrmAng';
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {

    if (this.receiptService.unsavedData) {
      $event.returnValue = true;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.generalService.sizeOfWindow.next(event.currentTarget.innerWidth);
  }

  ngOnInit() {
    this.receiptService.currentReceiptLine$.pipe(takeUntil(this.subscription$)).subscribe(data => console.log('RECEIPT DATA CURRENT', data))
  }



  ngOnDestroy() {
    this.authService.refreshFullState();
    this.receiptService.refreshNewReceipt();
    this.subscription$.next();
    this.subscription$.complete();
  }
}
