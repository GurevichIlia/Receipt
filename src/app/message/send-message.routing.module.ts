import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SendMessageComponent } from './send-message/send-message.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { TreeOfGroupsComponent } from './send-message/tree-of-groups/tree-of-groups.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MessageComponent } from './message.component';

export const sendMessageRoutes: Routes = [
      {
            path: '', component: SendMessageComponent, canActivate: [AuthGuardService]
      },
]

@NgModule({
      imports: [CommonModule,
            SharedModule,
            InfiniteScrollModule,
            TranslateModule, RouterModule.forChild(sendMessageRoutes)],
      exports: [],
      declarations: [
            SendMessageComponent,
            TreeOfGroupsComponent,
            MessageComponent]
})
export class SendMessageRoutingModule { }