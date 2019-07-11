import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SendMessageRoutingModule } from './send-message.routing.module';
import { SendMessageComponent } from './send-message/send-message.component';
import { SharedModule } from '../shared/shared.module';
import { TreeOfGroupsComponent } from './send-message/tree-of-groups/tree-of-groups.component';
import { MessageComponent } from './message.component';




@NgModule({
      declarations: [
            SendMessageComponent,
            TreeOfGroupsComponent,
            MessageComponent
      ],
      imports: [
            CommonModule,
            SharedModule,
            InfiniteScrollModule,
            TranslateModule,
            SendMessageRoutingModule
      ]
})
export class SendMessageModule { }