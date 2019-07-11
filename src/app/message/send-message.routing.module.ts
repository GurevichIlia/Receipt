import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SendMessageComponent } from './send-message/send-message.component';
import { AuthGuardService } from '../services/auth-guard.service';

const sendMessageRoutes: Routes = [
      {
            path: 'send-message', component: SendMessageComponent, canActivate: [AuthGuardService]
      },
]

@NgModule({
      imports: [RouterModule.forChild(sendMessageRoutes)],
      exports: [RouterModule]
})
export class SendMessageRoutingModule { }