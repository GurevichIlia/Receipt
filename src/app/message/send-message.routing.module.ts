import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SendMessageComponent } from './send-message/send-message.component';
import { AuthGuard } from '../receipts/services/auth.guard';
import { TreeOfGroupsComponent } from './send-message/tree-of-groups/tree-of-groups.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
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
            TranslateModule, RouterModule.forChild(sendMessageRoutes)],
      exports: [],
      declarations: [
            SendMessageComponent,
           
            MessageComponent]
})
export class SendMessageRoutingModule { }