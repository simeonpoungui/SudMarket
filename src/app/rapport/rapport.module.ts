import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RapportComponent } from './rapport/rapport.component';
import { RapportFormComponent } from './rapport-form/rapport-form.component';
import { RapportFicheComponent } from './rapport-fiche/rapport-fiche.component';



@NgModule({
  declarations: [
    RapportComponent,
    RapportFormComponent,
    RapportFicheComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RapportModule { }
