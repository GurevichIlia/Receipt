import { takeUntil } from 'rxjs/operators';
import { Component, Output, EventEmitter } from '@angular/core';
import { UploadService } from './../../core/services/upload.service';
import { Subject, pipe } from 'rxjs';

@Component({
  selector: 'app-upload-newsletter-file',
  templateUrl: './upload-newsletter-file.component.html',
  styleUrls: ['./upload-newsletter-file.component.css'],
  providers: [UploadService]
})
export class UploadNewsletterFileComponent {
  subscription$ = new Subject();
  @Output() action = new EventEmitter();
  constructor(private uploadService: UploadService) {

  }

  public imagePath;
  imgURL: any;
  public message: string;
  file
  fileURL: any

  dispatchAction(action: string) {
    this.action.emit({ action })
  }

  preview(files) {
    if (files.length === 0)
      return;

    this.file = files

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      var reader = new FileReader();
      // this.file = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.fileURL = reader.result;
      }
      return;

    } else {

      var reader = new FileReader();
      // this.file = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
      return;
    }

  }

  uploadFile() {
    this.uploadService.uploadFfile(this.file)
      .pipe(takeUntil(this.subscription$))
      .subscribe(res => {
        console.log('AFTER UPLOAD', res)
        if (res) {
          this.dispatchAction('REFRESH FILES')
        }
      })

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
  }
}
