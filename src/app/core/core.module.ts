import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { AlertComponent } from './alert/alert.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertInfoComponent } from './alert-info/alert-info.component';


@NgModule({
  declarations: [
    LoaderComponent,
    AlertComponent,
    AlertInfoComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    BrowserAnimationsModule,
  ],
  exports: [
    LoaderComponent,
    AlertComponent
  ]
})
export class CoreModule { }
