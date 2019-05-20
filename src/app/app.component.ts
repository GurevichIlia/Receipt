import { GeneralSrv } from './services/GeneralSrv.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import 'bootstrap/dist/css/bootstrap.css';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private generalService: GeneralSrv
  ) {
    translate.setDefaultLang('en');
  }



  title = 'jaffaCrmAng';

  ngOnInit() {
  
    // this.platform.setDir("ltr", true); ionio 4 nit support
    // document.body.setAttribute('dir', 'rtl');

    // this.authService.authenticationstate.subscribe(state => {
    //   console.log("authenticationstate:", state);
    //   if (state) {
    //     //alert("is loged in");
    //     //this.router.navigate(["creat-receipt"]);
    //   } else {
    //     this.router.navigate(["login"]);
    //     // alert("to login");
    //   }
    // });
  }

}
