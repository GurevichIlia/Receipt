import { HomeComponentComponent } from './home-component/home-component.component';
import { AuthGuard } from './receipts/services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './receipts/services/login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'home', component: HomeComponentComponent, canActivate: [AuthGuard], children: [
      { path: 'send-message', loadChildren: './message/send-message.routing.module#SendMessageRoutingModule', canActivate: [AuthGuard] },
      { path: 'newreceipt', loadChildren: './receipts/receipt.module#ReceiptModule' },
      { path: 'customer-details/:id', loadChildren: './customer-details/customer-details.module#CustomerDetailsModule' },
      { path: 'payments-grid', loadChildren: './grid/grid.module#GridModule', canActivate: [AuthGuard] },
    ]
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
