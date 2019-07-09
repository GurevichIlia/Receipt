import { GeneralSrv } from './services/GeneralSrv.service';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import 'bootstrap/dist/css/bootstrap.css';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReceiptsService } from './services/receipts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

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
      debugger
      $event.returnValue = true;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.generalService.sizeOfWindow.next(event.currentTarget.innerWidth);
  }

  ngOnInit() {
    this.receiptService.currentReceiptLine$.subscribe(data => console.log('RECEIPT DATA CURRENT', data))

  }
  ngOnDestroy() {
    this.authService.refreshFullState();
    this.receiptService.refreshNewReceipt();
  }
}
