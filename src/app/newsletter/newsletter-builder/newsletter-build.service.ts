import { GeneralSrv } from '../../shared/services/GeneralSrv.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Newsletter {
  HTML: string,
  CSS: string,
  TITLE: string
}

@Injectable(
//   {
//   providedIn: 'root'
// }
)
export class NewsletterBuildService {

  newsletterTemplateUrl = 'https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Empty-Template/Empty-Template.'
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/';
  constructor(
    private http: HttpClient,
    private generalService: GeneralSrv
  ) { }

  getHtml() {
    return this.http.get(`${this.newsletterTemplateUrl}html`)
  }

  getCss() {
    return this.http.get(`${this.newsletterTemplateUrl}css`)
  }

  getNewsletterToken() {
    return this.http.get(`${this.baseUrl}NewsLetter/LoginToStripo?guid=${this.generalService.getOrgName()}`)
  }

  saveNewsletter(newsletter: Newsletter) {
    return this.http.post(`${this.baseUrl}NewsLetter/SaveNewsLetterTpl?urlAddr=${this.generalService.getOrgName()}`, newsletter)
  }
}
