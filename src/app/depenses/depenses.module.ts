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
import { CategorieDepensesComponent } from './categorie-depenses/categorie-depenses.component';
import { SousCategorieDepensesComponent } from './sous-categorie-depenses/sous-categorie-depenses.component';
import { CategorieDepensesFormComponent } from './categorie-depenses-form/categorie-depenses-form.component';
import { SousCategorieDepensesFormComponent } from './sous-categorie-depenses-form/sous-categorie-depenses-form.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    DepenseComponent,
    DepenseFormComponent,
    CategorieDepensesComponent,
    SousCategorieDepensesComponent,
    CategorieDepensesFormComponent,
    SousCategorieDepensesFormComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatExpansionModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
    FormsModule,
    RouterModule,
    MatSortModule,
    MatTableModule
]
})
export class DepensesModule { }
