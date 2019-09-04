import { ReceiptsComponent } from './receipts.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const receipts: Routes = [
  {
    path: '', component: ReceiptsComponent
  }
]


@NgModule({
  declarations: [
    ReceiptsComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(receipts)
  ]
})
export class ReceiptsModule { }
