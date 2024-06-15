import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CoreModule } from '../core/core.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ClientComponent } from './client/client.component';
import { ClientFormComponent } from './client/client-form/client-form.component';
import { FicheClientComponent } from './client/fiche-client/fiche-client.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientFormComponent,
    FicheClientComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    CoreModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class ClientModule { }
