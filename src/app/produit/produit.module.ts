import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitComponent } from './produit/produit.component';
import { ProduitFormComponent } from './produit-form/produit-form.component';
import { ProduitFicheComponent } from './produit-fiche/produit-fiche.component';



@NgModule({
  declarations: [
    ProduitComponent,
    ProduitFormComponent,
    ProduitFicheComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProduitModule { }
