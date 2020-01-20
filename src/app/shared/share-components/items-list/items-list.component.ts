import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { NewsletterBuildService } from 'src/app/newsletter/newsletter-build.service';

export interface ItemKeys {
  keyForItemName?: string;
  keyForItemId?: string;
  keyForItemDate?: string;
  labelName: string
}

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsListComponent {
  @Input() itemsList;
  @Input() itemKeys: ItemKeys;
  constructor(private newsLetterService: NewsletterBuildService) { }


  dispatchAction(action: string, item: any) {
    this.newsLetterService.dispatchAction({ action, item })
  }
}
