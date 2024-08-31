import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoutiqueComponent } from './boutique/boutique.component';
import { BoutiqueFicheComponent } from './boutique-fiche/boutique-fiche.component';
import { BoutiqueFormComponent } from './boutique-form/boutique-form.component';
import { CoreModule } from "../core/core.module";
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BoutiqueComponent,
    BoutiqueFicheComponent,
    BoutiqueFormComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    MatTableModule
]
})
export class BoutiqueModule { }
