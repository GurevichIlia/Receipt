import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { GeneralSrv } from '../services/GeneralSrv.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentLang: string;
  subscriptions = new Subscription();
  mobileVersion: boolean;
  currentlyAuthStatus$;
  constructor(
    private authen: AuthenticationService,
    private router: Router,
    private generalSrv: GeneralSrv,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe(data => console.log('URL', data))
    this.checkWidth();
    // tslint:disable-next-line: max-line-length
    this.subscriptions.add(this.generalSrv.sizeOfWindow.subscribe(windowWidth => {
      this.mobileVersion = windowWidth > 500 ? false : true;
    }));
    this.subscriptions.add(this.generalSrv.currentLang$.subscribe(lang => this.currentLang = lang));
    this.currentlyAuthStatus$ = this.authen.currentlyAuthStatus;
  }
  checkWidth() {
    this.mobileVersion = window.innerWidth > 500 ? false : true;
  }
  logout() {
    if (confirm('יש לך שינויים שלא נשמרו! אם תעזוב, השינויים שלך יאבדו')) {
      this.authen.logout();
    }

  }
  goToSendMessage() {
    if (confirm('יש לך שינויים שלא נשמרו! אם תעזוב, השינויים שלך יאבדו')) {
      this.router.navigate(['send-message'])
    }
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscriptions.unsubscribe();
  }
}