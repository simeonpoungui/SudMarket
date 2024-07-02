import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProduitComponent } from './produit/produit.component';
import { ProduitFormComponent } from './produit-form/produit-form.component';
import { ProduitFicheComponent } from './produit-fiche/produit-fiche.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ProduitComponent,
    ProduitFormComponent,
    ProduitFicheComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule
  ]
})
export class ProduitModule { }
