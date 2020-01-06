import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsletterBuilderComponent } from './newsletter-builder/newsletter-builder.component';
import { Routes, RouterModule } from '@angular/router';
import { NewsletterBuildService } from './newsletter-builder/newsletter-build.service';

const newsLetterRoutes: Routes = [
  { path: '', component: NewsletterBuilderComponent }
]

@NgModule({
  declarations: [
    NewsletterBuilderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(newsLetterRoutes)
  ],
  exports: [],
  providers: [NewsletterBuildService]
})
export class NewsletterModule { }
