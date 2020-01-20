import { NewsletterTemplateList } from './../newsletter-build.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { NewsletterBuildService } from 'src/app/newsletter/newsletter-build.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-newsletter-aftersend',
  templateUrl: './newsletter-aftersend.component.html',
  styleUrls: ['./newsletter-aftersend.component.css']
})
export class NewsletterAftersendComponent implements OnInit {
  newsletterName = 'name'
  sendedNewsletter$: Observable<NewsletterTemplateList>;
  constructor(
    private newsletterService: NewsletterBuildService,
    private route: ActivatedRoute

  ) { }

  ngOnInit() {
    const templateId: number = +this.route.snapshot.queryParams['template'];

    this.sendedNewsletter$ = this.newsletterService.getListNewsletterTemplates().pipe(map(newsletters => newsletters.filter(newsletter => newsletter.TplCodeId === templateId)[0]));
  }

}
