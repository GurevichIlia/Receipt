import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './../material.module';

import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';

@NgModule({
      declarations: [

      ],
      // imports: [

      // ],
      exports: [
            CommonModule,
            ReactiveFormsModule,
            FormsModule,
            MaterialModule,
            NgxUiLoaderModule, // import NgxUiLoaderModule
            NgxUiLoaderRouterModule,
            // import NgxUiLoaderRouterModule. By default, it will show foreground loader.
            // If you need to show background spinner, do as follow:


      ]
})
export class SharedModule {

}