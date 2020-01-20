import { SendNewsletterService } from './send-newsletter.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { SendNewsletterComponent } from './send-newsletter.component';
import { SenderFormComponent } from '../sender-form/sender-form.component';
import { SendDatePickerComponent } from '../send-date-picker/send-date-picker.component';
import { SendDatePickerService } from '../send-date-picker/send-date-picker.service';

const sendingRoutes: Routes = [
  {path: '', component: SendNewsletterComponent}
]

@NgModule({
  declarations: [
    SendNewsletterComponent,
    SenderFormComponent,
    SendDatePickerComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(sendingRoutes)
  ],
  providers: [SendNewsletterService, SendDatePickerService]
})
export class SendNewsletterModule { }
