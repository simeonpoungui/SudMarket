import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FournisseurComponent } from './fournisseur/fournisseur.component';
import { FournisseurFormComponent } from './fournisseur-form/fournisseur-form.component';
import { FournisseurFicheComponent } from './fournisseur-fiche/fournisseur-fiche.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CoreModule } from '../core/core.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FournisseurComponent,
    FournisseurFormComponent,
    FournisseurFicheComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    CoreModule,
    MatTableModule,
    FormsModule
  ]
})
export class FournisseurModule { }
