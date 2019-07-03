import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { GeneralSrv } from '../services/GeneralSrv.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentLang: string;
  subscriptions = new Subscription();
  constructor(
    private authen: AuthenticationService,
    private router: Router,
    private generalSrv: GeneralSrv,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.generalSrv.currentLang$.subscribe(lang => this.currentLang = lang));

  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscriptions.unsubscribe();
  }
}
