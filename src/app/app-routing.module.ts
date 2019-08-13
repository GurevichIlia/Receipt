import { HomeComponentComponent } from './home-component/home-component.component';
import { AuthGuard } from './receipts/services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewReceiptComponent } from './receipts/new-receipt/new-receipt.component';
import { LoginGuard } from './receipts/services/login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponentComponent, canActivate: [AuthGuard]  },
  { path: 'send-message', loadChildren: './message/send-message.routing.module#SendMessageRoutingModule', canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'newreceipt', loadChildren: './receipts/receipt.module#ReceiptModule'},
  
  { path: 'payments-grid', loadChildren: './grid/grid.module#GridModule', canActivate: [AuthGuard] },
  // { path: 'send-message', component: SendMessageComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
