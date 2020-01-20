import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { NewsletterBuilderComponent } from './newsletter-builder/newsletter-builder.component';
import { Routes, RouterModule } from '@angular/router';
import { NewsletterBuildService } from './newsletter-build.service';
import { NewsletterComponent } from './newsletter.component';
import { NewsletterBuilderHeaderComponent } from './newsletter-builder-header/newsletter-builder-header.component';
import { NewsletterAftersendComponent } from './newsletter-aftersend/newsletter-aftersend.component';
import { UploadNewsletterFileComponent } from './upload-newsletter-file/upload-newsletter-file.component';


const newsLetterRoutes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'builder'
  },
  { path: 'builder', component: NewsletterComponent },

  { path: 'sending',  loadChildren: './send-newsletter/send-newsletter.module#SendNewsletterModule' },

  { path: 'sent', component: NewsletterAftersendComponent }



]

@NgModule({
  declarations: [
    NewsletterBuilderComponent,
    NewsletterComponent,
    NewsletterBuilderHeaderComponent,
    NewsletterAftersendComponent,
    UploadNewsletterFileComponent,

    

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
