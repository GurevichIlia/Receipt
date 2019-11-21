import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements OnInit {
  @Input() array: any[] = [];
  @Input() formControl: FormControl = new FormControl('');
  @Input() placeHolder: string = '';
  @Input() required: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
