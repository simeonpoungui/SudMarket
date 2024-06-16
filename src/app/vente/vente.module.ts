import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenteComponent } from './vente/vente.component';
import { VenteFormComponent } from './vente-form/vente-form.component';
import { VenteFicheComponent } from './vente-fiche/vente-fiche.component';



@NgModule({
  declarations: [
    VenteComponent,
    VenteFormComponent,
    VenteFicheComponent
  ],
  imports: [
    CommonModule
  ]
})
export class VenteModule { }
