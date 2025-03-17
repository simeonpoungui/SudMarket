import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FournisseurComponent } from './fournisseur/fournisseur.component';
import { FournisseurFormComponent } from './fournisseur-form/fournisseur-form.component';
import { FournisseurFicheComponent } from './fournisseur-fiche/fournisseur-fiche.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CoreModule } from '../core/core.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommandeAchatModule } from '../commande-achat/commande-achat.module';
import { RouterModule } from '@angular/router';
import { SelectFournisseurComponent } from './select-fournisseur/select-fournisseur.component';

@NgModule({
  declarations: [
    FournisseurComponent,
    FournisseurFormComponent,
    FournisseurFicheComponent,
    SelectFournisseurComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    CoreModule,
    CommandeAchatModule,
    MatTableModule,
    FormsModule
  ]
})
export class FournisseurModule { }
