import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { GeneralSrv } from '../services/GeneralSrv.service';
import { AuthenticationService } from '../services/authentication.service';
import { Guid } from 'guid-typescript';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private generalSrv: GeneralSrv,
    private authen: AuthenticationService,
    private router: Router
  ) {

  }

  username: string;
  password: string;
  orgid: string;

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    orgid: new FormControl('')
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

          // response = JSON.parse(response);
          if (response.IsError == true) {
            // this.disableAfterclick = false;
            // this.generalSrv.presentAlert(
            //   "Error",
            //   "an error acured",
            //   response.ErrMsg
            // );
          } else {
            this.authen.login(response.Data);
            this.generalSrv.setOrgName(this.form.controls['orgid'].value);
            // this.router.navigate(["newreceipt"]);
            // debugger;
            this.router.navigate(['newreceipt']);
          }
        },
        error => {
          console.log(error);
          // this.disableAfterclick = false;
        },
        () => {
          console.log('CallCompleted');
        }
      );
  }
}
