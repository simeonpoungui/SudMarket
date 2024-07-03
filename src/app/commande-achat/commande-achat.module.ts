import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeAChatComponent } from './commande-achat/commande-achat.component';
import { CommandeAChatFormComponent } from './commande-achat-form/commande-achat-form.component';
import { CommandeAChatFicheComponent } from './commande-achat-fiche/commande-achat-fiche.component';
import { CoreModule } from '../core/core.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ArticlesCommandesAchatsComponent } from './articles-commandes-achats/articles-commandes-achats.component';
import { SessionCommandeComponent } from './session-commande/session-commande.component';

@NgModule({
  declarations: [
    CommandeAChatComponent,
    CommandeAChatFormComponent,
    CommandeAChatFicheComponent,
    ArticlesCommandesAchatsComponent,
    SessionCommandeComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatPaginatorModule,
    FormsModule,
    MatTableModule
  ]
})
export class CommandeAchatModule { }
