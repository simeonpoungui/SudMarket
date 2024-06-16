import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RapportComponent } from './rapport/rapport.component';
import { RapportFormComponent } from './rapport-form/rapport-form.component';
import { RapportFicheComponent } from './rapport-fiche/rapport-fiche.component';
import { CoreModule } from '../core/core.module';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    RapportComponent,
    RapportFormComponent,
    RapportFicheComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    CoreModule,
    RouterModule
  ]
})
export class RapportModule { }
