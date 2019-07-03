import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { AuthGuardService } from './services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewReceiptComponent } from './receipts/new-receipt/new-receipt.component';
import { TestCComponent } from './test-c/test-c.component';
import { SendMessageComponent } from './send-message/send-message.component';

const routes: Routes = [
  { path: '', redirectTo: 'newreceipt',
   pathMatch: 'full'
   },
  { path: 'login', component: LoginComponent, },
  { path: 'newreceipt', canActivate: [AuthGuardService], component: NewReceiptComponent , canDeactivate: [CanDeactivateGuardService] },
  { path: 'test', component: TestCComponent },
  { path: 'send-message', component: SendMessageComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/newreceipt'},
  // { path: "home", loadChildren: "./home/home.module#HomePageModule" },
  // {
  //   path: "creat-receipt",
  //   loadChildren:
  //     "./pages/creat-receipt/creat-receipt.module#CreatReceiptPageModule",
  //   canActivate: [AuthGuardService]
  // },
  // {
  //   path: "login-page",
  //   loadChildren: "./pages/login-page/login-page.module#LoginPagePageModule"
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
