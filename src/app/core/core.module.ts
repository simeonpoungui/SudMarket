import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { AlertComponent } from './alert/alert.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    LoaderComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    LoaderComponent,
    AlertComponent
  ]
})
export class CoreModule { }
