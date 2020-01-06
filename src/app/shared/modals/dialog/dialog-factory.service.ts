import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { first } from 'rxjs/operators';

// Components
import { DialogComponent } from './dialog.component'

// Models
export interface DialogData<T> { }

export interface DialogOptions {
  width: string | number;
  height?: string | number;
  disableClose: boolean;
}
// Services
import { DialogService } from './dialogService';

@Injectable({
  providedIn: 'root'
})
export class DialogFactoryService<T = undefined> {

  constructor(private dialog: MatDialog) { }

  open(
    dialogData: DialogData<T>,
    options: DialogOptions = { width: 500, height: 300 ,disableClose: true }
  ): DialogService<T> {
    const dialogRef = this.dialog.open<DialogComponent<T>, DialogData<T>>(
      DialogComponent,
      {
        ...this.fetchOptions(options),
        data: dialogData
      }
    )

    dialogRef.afterClosed().pipe(first())

    return new DialogService(dialogRef)
  }

  private fetchOptions({ width, height, disableClose }: DialogOptions): Pick<MatDialogConfig<DialogData<T>>, 'width' | 'disableClose' | 'height'> {
    return {
      width: `${width}px`, height: `${height}px`, disableClose
    }
  }
}
