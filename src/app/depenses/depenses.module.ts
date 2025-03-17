import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepenseComponent } from './depense/depense.component';
import { DepenseFormComponent } from './depense-form/depense-form.component';
import { CoreModule } from "../core/core.module";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DepenseComponent,
    DepenseFormComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatPaginatorModule,
    MatDialogModule,
    FormsModule,
    RouterModule,
    MatSortModule,
    MatTableModule
]
})
export class DepensesModule { }
