import { TranslationService } from './translation.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AskQuestionComponent } from 'src/app/shared/modals/ask-question/ask-question.component';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
      providedIn: 'root'
})
export class NotificationsService {
      constructor(
            private toastrService: ToastrService,
            private translate: TranslationService,
            private matDialog: MatDialog
      ) {
      }
      success(message?: string, title?: string) {

            this.toastrService.success(this.translate.onTranslate(message), this.translate.onTranslate(title))
      }

      warn(message?: string, title?: string) {
            this.toastrService.warning(this.translate.onTranslate(message), this.translate.onTranslate(title))
      }

      error(message?: string, title?: string) {
            this.toastrService.error(this.translate.onTranslate(message), this.translate.onTranslate(title))
      }

      askQuestion(text: string, item: { name?: string, id?: number }): Observable<MatDialog> {
            const openedModal$ = this.matDialog.open(AskQuestionComponent,
                  {
                        height: '150', width: '350px', disableClose: true, position: { top: 'top' },
                        panelClass: 'question',
                        data: { questionText: text, acceptButtonName: 'Confirm', closeButtonName: 'Cancel', item: { name: item.name, id: item.id } }
                  })
                  .afterClosed().pipe(filter(answer => answer === true));
            return openedModal$;
      }
}