import { Response } from './../../models/response.model';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Sender, NewSender, senderData } from 'src/app/models/send-newsletter.interfaces';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GeneralSrv } from 'src/app/shared/services/GeneralSrv.service';

@Injectable(

)
export class SendNewsletterService {
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/';
  newsletterSenders$: Observable<Sender[]>
  sendedNewsletter = new BehaviorSubject(null);
  constructor(
    private http: HttpClient,
    private generalService: GeneralSrv,
  ) { }


  getListOfSenders() {
    if (!this.newsletterSenders$) {
      this.newsletterSenders$ = this.http.get<Observable<Sender[]>>(`${this.baseUrl}NewsLetter/GetNewsLetterSenders?urlAddr=${this.generalService.getOrgName()}`).pipe(
        map((response) => {
          console.log('SENDERS', response)
          if (response['IsError'] === 'true') {
            console.log('MY ERROR', response['ErrMsg'])
            return []
          } else {
            const senders: Sender[] = response['Data'].GetNewsLetterSenders as Sender[]
            return senders
          }
        }),
        catchError(err => {
          console.log('ERROR', err)
          return of(<Sender[]>[])
        }),
        shareReplay(1)
      )

    }
    return this.newsletterSenders$;

  }

  saveNewsletterSender(newSender: Sender | NewSender) {
    return this.http.post(`${this.baseUrl}NewsLetter/SaveNewsLetterSenders?urlAddr=${this.generalService.getOrgName()}`, newSender).pipe(map((response: Response) => response.Data))
  }

  sendNewsletter(newsletterData: senderData) {
    return this.http.post(`${this.baseUrl}NewsLetter/SendNewsLetter?urlAddr=${this.generalService.getOrgName()}`, newsletterData).pipe(map((response: Response) => response.Data))

  }

  clearSenders() {
    this.newsletterSenders$ = undefined;
  }

  
}
