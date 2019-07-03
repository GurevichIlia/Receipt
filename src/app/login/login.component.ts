import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { GeneralSrv } from '../services/GeneralSrv.service';
import { AuthenticationService } from '../services/authentication.service';
import { TranslateService } from '@ngx-translate/core';


import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  currentLang: string;
  subscription: Subscription = new Subscription();
  constructor(
    private generalSrv: GeneralSrv,
    private authen: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    translate.setDefaultLang('he');
    this.generalSrv.language.next('he');
  }

  username: string;
  password: string;
  orgid: string;

  form: FormGroup = new FormGroup({
    username: new FormControl(localStorage.getItem('username')),
    password: new FormControl(''),
    orgid: new FormControl(localStorage.getItem('organisationName'))
  });
  submit() {
    if (this.form.valid) {
      // this.submitEM.emit(this.form.value);
      // debugger;
      if (
        this.form.controls['username'].value &&
        this.form.controls['orgid'].value &&
        this.form.controls['password'].value
      ) {
        this.DoLogin();
      }
    }
  }

  // @Input() error: string | null;
  // @Output() submitEM = new EventEmitter();

  ngOnInit() {
    // this.platform.setDir("ltr", true); ionio 4 nit support
    this.subscription.add(this.generalSrv.currentLang$.subscribe(lang => this.currentLang = lang));
    document.body.setAttribute('dir', 'rtl');
  }

  DoLogin() {
    // .SaveKevaInfo(value, this.pathArray[this.pathArray.length - 1])
    this.generalSrv
      .validateLogin(
        'sdsds',
        this.form.controls['username'].value,
        this.form.controls['password'].value,
        this.form.controls['orgid'].value
      )
      .subscribe(
        response => {
          console.log('RESPONSE', response)
          // response = JSON.parse(response);
          if (response.IsError == true) {
            let errMes;
            if (this.currentLang === 'he') {
              errMes = 'לא מצליח להתחבר! לבדוק את שם המשתמש או הסיסמה שלך';
            } else {
              errMes = response.ErrMsg;
            }
            this.toastr.error(errMes, '', { positionClass: 'toast-top-center' });

          } else {
            this.toastr.success('', 'מחובר', { positionClass: 'toast-top-center' });

            this.authen.login(response.Data);
            this.generalSrv.setOrgName(this.form.controls['orgid'].value, response.Data.EmployeeId);
            // this.router.navigate(["newreceipt"]);
            // debugger;
            localStorage.setItem('username', this.form.controls['username'].value);
            localStorage.setItem('organisationName', this.form.controls['orgid'].value);
            this.router.navigate(['newreceipt']);
          }
        },
        error => {
          const err = error.ok === false ? 'Check the internet connection' : error;
          this.toastr.error(err, 'Something went wrong', { positionClass: 'toast-top-center' });

          console.log(error);
          // this.disableAfterclick = false;
        },
        () => {
          console.log('CallCompleted');
        }
      );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
