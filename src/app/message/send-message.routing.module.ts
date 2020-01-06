import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SendMessageComponent } from './send-message/send-message.component';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MessageComponent } from './message.component';

export const sendMessageRoutes: Routes = [
      {
            path: '', component: MessageComponent,
      },
]

@NgModule({
      imports: [CommonModule,
            SharedModule,
            TranslateModule,
             RouterModule.forChild(sendMessageRoutes)],
      exports: [],
      declarations: [
            SendMessageComponent,
           
            MessageComponent]
})
export class SendMessageRoutingModule { }