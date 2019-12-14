import { HomeComponentComponent } from './home-component/home-component.component';
import { AuthGuard } from './receipts/services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './receipts/services/login.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'  },
  { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [LoginGuard] },
  {
    path: 'home', component: HomeComponentComponent, canActivate: [AuthGuard], children: [
      { path: 'send-message', loadChildren: './message/send-message.routing.module#SendMessageRoutingModule', canActivate: [AuthGuard] },
      { path: 'newreceipt', loadChildren: './receipts/receipt.module#ReceiptModule', canActivate: [AuthGuard] },
      { path: 'customer-details/customer', loadChildren: './customer-details/customer-details.module#CustomerDetailsModule', canActivate: [AuthGuard] },
      { path: 'payments-grid', loadChildren: './grid/grid.module#GridModule', canActivate: [AuthGuard] },
      { path: 'new-customer', loadChildren: './new-customer/new-customer.module#NewCustomerModule', canActivate:[AuthGuard] }
    ]
  },
  { path: '**', redirectTo: 'home' },

]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

