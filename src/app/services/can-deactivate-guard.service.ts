import { Injectable } from '@angular/core';
import { ReceiptsService } from './receipts.service';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuardService {

  constructor(
    private receiptService: ReceiptsService

  ) { }
  // You have unsaved changes! If you leave, your changes will be lost.
  canDeactivate() {
    if (this.receiptService.unsavedData) {
      if (confirm('יש לך שינויים שלא נשמרו! אם תעזוב, השינויים שלך יאבדו')) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}

