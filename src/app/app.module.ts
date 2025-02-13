import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { AskTokenComponent } from './login/ask-token/ask-token.component';
import { CoreModule } from "./core/core.module";
import { AuthInterceptor } from './login/auth.interceptor';
import { HttpErrorInterceptor } from './login/error.interceptors';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    AskTokenComponent,
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatPaginatorModule,
    FormsModule,
    MatSortModule,
    MatDialogModule,
    AppRoutingModule,
    HttpClientModule,
    QuillModule.forRoot(),
    MatTableModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-center-center' 
    }),
    CoreModule
],
providers: [
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: AuthInterceptor,
  //   multi: true
  // },
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: HttpErrorInterceptor,
  //   multi: true
  // }
],
  bootstrap: [AppComponent],
})
export class AppModule { }
