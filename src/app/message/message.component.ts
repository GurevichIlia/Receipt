import { GlobalStateService } from './../shared/global-state-store/global-state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerGroupsService } from './../core/services/customer-groups.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {

  constructor(
    private globalStateService: GlobalStateService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.globalStateService.clearSelectedMark();
  }
}
