import { FormControl } from '@angular/forms';
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[inputError]'
})
export class HighlightErrorIfInvalidDirective implements OnChanges {
  @Input() isSubmit: boolean;
  @Input() input: FormControl
  constructor(private element: ElementRef) { }



  ngOnChanges() {
    if (this.isSubmit) {
      setTimeout(() => {
        this.input.markAsTouched();
        this.input.updateValueAndValidity();
        this.onFocus();
      }, 10)
    }

  }

  onFocus() {
    const invalidControl = this.element.nativeElement;
    if (invalidControl && invalidControl.className.includes('ng-invalid')) {
      invalidControl.focus();
    }

  }

}
