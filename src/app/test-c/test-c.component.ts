import { Component, Injectable } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormControl
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";

import {
  catchError,
  map,
  tap,
  startWith,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  takeWhile,
  first
} from "rxjs/operators";
import { Observable, throwError, empty } from "rxjs";
import { GeneralSrv } from "../receipts/services/GeneralSrv.service";

@Injectable()
export class Service {
  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.httpClient.get<any>(
      "https://jsonplaceholder.typicode.com/users"
    );
  }
}

@Component({
  selector: "my-app",
  template: `
    <form>
      <mat-form-field>
        <input matInput [matAutocomplete]="auto" [formControl]="myControl" />
        <mat-autocomplete #auto="matAutocomplete">
          <mat-option
            *ngFor="let user of (filteredOptions | async)"
            [value]="user.name"
          >
            <span>{{ user.name }}</span>
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
    </form>
  `,
  styleUrls: ["./test-c.component.css"]
})
export class TestCComponent {
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;

  constructor(private generalSrv: GeneralSrv) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || "");
      })
    );
  }

  filter(val: string): Observable<any[]> {
    return this.generalSrv.getUsers().pipe(
      map(response =>
        response.filter(option => {
          return option.name.toLowerCase().indexOf(val.toLowerCase()) === 0;
        })
      )
    );
  }
}
