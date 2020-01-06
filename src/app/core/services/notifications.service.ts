import { TranslationService } from './translation.service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
      providedIn: 'root'
})
export class NotificationsService {
      constructor(
            private toastrService: ToastrService,
            private translate: TranslationService
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
}