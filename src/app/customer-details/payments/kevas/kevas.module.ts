import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { KevasComponent } from './kevas.component';


const kevaRoutes: Routes = [
  { path: '', component: KevasComponent }
]

@NgModule({
  declarations: [KevasComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(kevaRoutes)
  ],
  exports:[]
})
export class KevasModule { }
