import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeAChatComponent } from './commande-achat/commande-achat.component';
import { CommandeAChatFormComponent } from './commande-achat-form/commande-achat-form.component';
import { CommandeAChatFicheComponent } from './commande-achat-fiche/commande-achat-fiche.component';


@NgModule({
  declarations: [
    CommandeAChatComponent,
    CommandeAChatFormComponent,
    CommandeAChatFicheComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CommandeAchatModule { }
