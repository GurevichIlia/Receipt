import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  subscription$ = new Subject()
  constructor(private translate: TranslateService) { }

  onTranslate(textForTranslate: string) {
    let translation = ''
    if (textForTranslate) {
    this.translate.get(textForTranslate)
        .pipe(takeUntil(this.subscription$))
        .subscribe(translated => {
          console.log(translated);
          this.subscription$.next();
          this.subscription$.complete();
          translation = translated
        }, err => console.log(err)
          , () => console.log('Complete' )
        )
      return translation;
    }

  }

}
