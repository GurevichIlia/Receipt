import { SideBarService } from './side-bar.service';
import { FullCustomerDetailsById } from 'src/app/models/fullCustomerDetailsById.model';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  customerDetailsById$: Observable<FullCustomerDetailsById>
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
    this.sidebarService.setCurrentMenuItem(menuItem);
  }
}
