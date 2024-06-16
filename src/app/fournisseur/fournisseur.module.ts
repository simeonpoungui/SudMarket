import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FournisseurComponent } from './fournisseur/fournisseur.component';
import { FournisseurFormComponent } from './fournisseur-form/fournisseur-form.component';
import { FournisseurFicheComponent } from './fournisseur-fiche/fournisseur-fiche.component';



@NgModule({
  declarations: [
    FournisseurComponent,
    FournisseurFormComponent,
    FournisseurFicheComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FournisseurModule { }
