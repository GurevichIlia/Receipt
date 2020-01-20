import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import { NewsletterBuildService } from '../newsletter-build.service';

@Component({
  selector: 'app-newsletter-builder-header',
  templateUrl: './newsletter-builder-header.component.html',
  styleUrls: ['./newsletter-builder-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterBuilderHeaderComponent implements OnInit {
  @Input() showGroups = false;
  @Input() templateId: number

  constructor(private newsletterService: NewsletterBuildService) { }

  ngOnInit() {
  }

  dispatchAction(action: string) {
    this.newsletterService.dispatchAction({ action });
  }
}
