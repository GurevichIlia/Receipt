import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainInfoViewComponent } from './main-info-view/main-info-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainInfoComponent } from './main-info.component';
import { Routes, RouterModule } from '@angular/router';
import { PhonesInfoComponent } from './phones-info/phones-info.component';
import { EmailsInfoComponent } from './emails-info/emails-info.component';
import { AddressesInfoComponent } from './addresses-info/addresses-info.component';

const mainInfoRoutes: Routes = [
  {
    path: '', component: MainInfoComponent
  }
]


@NgModule({
  declarations: [
    MainInfoComponent,
    MainInfoViewComponent,
    PhonesInfoComponent,
    EmailsInfoComponent,
    AddressesInfoComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(mainInfoRoutes)
  ],
  exports: [
    MainInfoComponent,
    MainInfoViewComponent
  ]
})
export class MainInfoModule { }
