import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent {
  pickedMenu: string;

  @Output() selectedRoute = new EventEmitter();

  constructor() {

  }
  selectChildMenuItem(menuItem: string, childMenuItem: string) {
    this.navigateTo(menuItem, childMenuItem);
      this.pickedMenu = menuItem;
  }
  navigateTo(route: string, childMenuItem: string) {
    this.selectedRoute.emit({ route, childMenuItem });
  }
}