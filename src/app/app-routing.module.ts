import { HomeComponentComponent } from './home-component/home-component.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewReceiptComponent } from './receipts/new-receipt/new-receipt.component';
import { LoginGuard } from './services/login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponentComponent },
  { path: 'send-message', loadChildren: './message/send-message.routing.module#SendMessageRoutingModule' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'newreceipt', loadChildren: './receipts/receipt.module#ReceiptModule'},
  
  { path: 'payments-grid', loadChildren: './grid/grid.module#GridModule' },
  // { path: 'send-message', component: SendMessageComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
