import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClotureJourneeComponent } from './cloture-journee/cloture-journee.component';
import { EtatCaisseVendeurComponent } from './etat-caisse-vendeur/etat-caisse-vendeur.component';
import { HistoriqueDesCaissesVendeurComponent } from './historique-des-caisses-vendeur/historique-des-caisses-vendeur.component';
import { CoreModule } from '../core/core.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CaisseVendeurComponent } from './caisse-vendeur/caisse-vendeur.component';
import { FormComponent } from './caisse-vendeur/form/form.component';
import { FicheComponent } from './caisse-vendeur/fiche/fiche.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    ClotureJourneeComponent,
    EtatCaisseVendeurComponent,
    HistoriqueDesCaissesVendeurComponent,
    CaisseVendeurComponent,
    FormComponent,
    FicheComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    RouterModule,
    FormsModule
  ]
})
export class ComptabiliteModule { }
