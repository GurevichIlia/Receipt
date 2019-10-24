import { SideBarService } from './side-bar.service';
import { FullCustomerDetailsById } from 'src/app/models/fullCustomerDetailsById.model';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import { trigger, state, keyframes, animate, transition } from '@angular/animations';
import * as kf from '../../shared/keyframes';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  animations: [
    trigger('wordCardAnimator', [
      transition('* => bounceInRight', animate(500, keyframes(kf.bounceInRight))),
      transition('* => bounceOutUp', animate(500, keyframes(kf.bounceOutUp))),
      transition('* => bounceInDown', animate(500, keyframes(kf.bounceInDown))),
      transition('* => bounceInLeft', animate(500, keyframes(kf.bounceInLeft)))

    ])
  ]
})
export class SideBarComponent implements OnInit {
  customerDetailsById$: Observable<FullCustomerDetailsById>
  animationState: string
  constructor(private sidebarService: SideBarService) { }

  ngOnInit() {
    this.getCustomerDetailsById();
  }
  getCustomerDetailsById() {
    this.customerDetailsById$ = this.sidebarService.getCustomerInfoById$();
  }
  setChildItem(item: string) {
    this.sidebarService.setChildMenuItem(item);
  }
  setCurrentMenuItem(menuItem: { route: string, childMenuItem: string }) {
    debugger
    this.sidebarService.setCurrentMenuItem(menuItem);
  }

  // startAnimation(stateAnimate) {
  //   console.log(stateAnimate);
  //   if (!this.animationState) {
  //     this.animationState = stateAnimate;
  //   }
  // }
  // resetAnimationState() {
  //   this.animationState = '';
  // }
}
