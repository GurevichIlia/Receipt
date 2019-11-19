import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent {
  @Input() animationState: string;
  @Output() selectedRoute = new EventEmitter();
  mainInfoNestMenu = false;
  paymentsNestMenu = false;
  pickedMenu: string;

  constructor() {

  }
  selectChildMenuItem(menuItem: string, childMenuItem: string) {
    this.navigateTo(menuItem, childMenuItem);
    this.pickedMenu = menuItem;
  }
  
  navigateTo(route: string, childMenuItem: string) {
    this.selectedRoute.emit({ route, childMenuItem });
  }

  startAnimation(stateAnimate) {
    console.log(stateAnimate);
    if (!this.animationState) {
      this.animationState = stateAnimate;
    }
  }
}