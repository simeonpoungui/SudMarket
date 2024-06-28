import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerComponent } from './scanner/scanner.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';


@NgModule({
  declarations: [
    ScannerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    ZXingScannerModule
  ]
})
export class ScannerQrcodeModule { }
