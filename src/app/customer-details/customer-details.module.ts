import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { CustomerPhotoComponent } from './side-bar/customer-photo/customer-photo.component';
import { CustomerInfoComponent } from './side-bar/customer-info/customer-info.component';
import { SideMenuComponent } from './side-bar/side-menu/side-menu.component';

const customerRouter: Routes = [
  {
    path: '', component: CustomerDetailsComponent, children: [
      { path: 'payments', loadChildren: './payments/payments.module#PaymentsModule' },
      { path: 'main-info', loadChildren: './main-info/main-info.module#MainInfoModule' },
    ]
  }
];
@NgModule({
  declarations: [
    CustomerDetailsComponent,
    SideBarComponent,
    CustomerPhotoComponent,
    CustomerInfoComponent,
    SideMenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(customerRouter)
  ]
})
export class CustomerDetailsModule { }