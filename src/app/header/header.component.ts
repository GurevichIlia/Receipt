import { PaymentsService } from 'src/app/grid/payments.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralSrv } from '../shared/services/GeneralSrv.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


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
    private paymentsService: PaymentsService
  ) { }

  ngOnInit() {
    this.checkWidth();
    // tslint:disable-next-line: max-line-length
    this.generalSrv.sizeOfWindow.pipe(takeUntil(this.unsubscribe$)).subscribe(windowWidth => {
      this.mobileVersion = windowWidth > 1100 ? false : true;
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
    this.currentlyAuthStatus$ = this.auth.currentlyAuthStatus$

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
      this.router.navigate(['send-message']);
    }
  }
  goToGrid() {
    this.router.navigate(['payments-grid']);
  }
  goToCustomerDetails() {
    this.router.navigate([`customer-details/customer/main-info`]);
  }
  goToReceipt(){
    this.router.navigate(['newreceipt']);
  }
  createNewCustomer() {
    this.router.navigate(['new-customer']);
  }

  goToNewsletter(){
    this.router.navigate(['newsletter']);
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }
}