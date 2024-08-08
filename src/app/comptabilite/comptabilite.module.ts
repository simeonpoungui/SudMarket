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
import { CaissePrincipaleComponent } from './caisse-principale/caisse-principale.component';
import { CaisseExploitationComponent } from './caisse-exploitation/caisse-exploitation.component';
import { TransfertInterCaisseComponent } from './transfert-inter-caisse/transfert-inter-caisse.component';
import { HistoriquesSoldesFermatureCaissesComponent } from './historiques-soldes-fermature-caisses/historiques-soldes-fermature-caisses.component';
import { TransfertInterCaisseBanquaireComponent } from './transfert-inter-caisse-banquaire/transfert-inter-caisse-banquaire.component';
@NgModule({
  declarations: [
    ClotureJourneeComponent,
    EtatCaisseVendeurComponent,
    HistoriqueDesCaissesVendeurComponent,
    CaisseVendeurComponent,
    FormComponent,
    FicheComponent,
    CaissePrincipaleComponent,
    CaisseExploitationComponent,
    TransfertInterCaisseComponent,
    HistoriquesSoldesFermatureCaissesComponent,
    TransfertInterCaisseBanquaireComponent,
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
