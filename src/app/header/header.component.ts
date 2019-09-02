import { PaymentsService } from 'src/app/grid/payments.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../receipts/services/authentication.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { GeneralSrv } from '../receipts/services/GeneralSrv.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentLang: string;
  subscriptions = new Subscription();
  mobileVersion: boolean;
  currentlyAuthStatus$: Observable<boolean>;
  typeOfUser = null;
  unsubscribe$ = new Subject<void>();
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private generalSrv: GeneralSrv,
    private activatedRoute: ActivatedRoute,
    private store: Store<{ auth: fromApp.State }>,
    private paymentsService: PaymentsService
  ) { }

  ngOnInit() {
    this.checkWidth();
    // tslint:disable-next-line: max-line-length
    this.generalSrv.sizeOfWindow.pipe(takeUntil(this.unsubscribe$)).subscribe(windowWidth => {
      this.mobileVersion = windowWidth > 800 ? false : true;
    });
    this.generalSrv.currentLang$.pipe(takeUntil(this.unsubscribe$)).subscribe(lang => this.currentLang = lang);
    this.getAuthStatus();
    this.getTypeofuser();
  }
  getTypeofuser() {
    this.auth.currentTypeOfUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((type: number) => {
      this.typeOfUser = type;
      console.log('TYPE', type);
    })
  }
  getAuthStatus() {
    // this.currentlyAuthStatus$ = this.auth.currentlyAuthStatus;
    this.currentlyAuthStatus$ = this.store.pipe(map(state => state.auth.isLogged
    ));

  }
  checkWidth() {
    this.mobileVersion = window.innerWidth > 800 ? false : true;
  }
  logout() {
    if (confirm('יש לך שינויים שלא נשמרו! אם תעזוב, השינויים שלך יאבדו')) {
      this.auth.logout();
    }

  }
  goToSendMessage() {
    if (confirm('יש לך שינויים שלא נשמרו! אם תעזוב, השינויים שלך יאבדו')) {
      this.router.navigate(['home/send-message'])
    }
  }
  goToGrid() {
    this.router.navigate(['home/payments-grid'])
  }
  goToCustomerDetails() {
    this.router.navigate([`home/customer-details/${1}`])
  }
  goToReceipt(){
    this.router.navigate(['home/newreceipt'])
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }
}