import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../receipts/services/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentlyAuthStatus$: Observable<boolean>
  constructor(
    private auth: AuthenticationService,
  ) { }

  ngOnInit() {
    this.getAuthStatus();
  }

  getAuthStatus() {
    this.currentlyAuthStatus$ = this.auth.currentlyAuthStatus$

  }
}
