import { SharedModule } from 'src/app/shared/shared.module';
import { LoginRouterModule } from './login-router.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule,
    LoginRouterModule,
    CommonModule
  ]
})
export class LoginModule { }
