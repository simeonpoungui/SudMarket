import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionVenteComponent } from './session-vente/session-vente.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CoreModule } from '../core/core.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListSessionVenteComponent } from './list-session-vente/list-session-vente.component';
import { HistoriqueSessionByPointDeVenteComponent } from './historique-session-by-point-de-vente/historique-session-by-point-de-vente.component';
import { ValidatePayementComponent } from './validate-payement/validate-payement.component';
import { PrintRecuComponent } from './print-recu/print-recu.component';

@NgModule({
  declarations: [
    SessionVenteComponent,
    ListSessionVenteComponent,
    HistoriqueSessionByPointDeVenteComponent,
    ValidatePayementComponent,
    PrintRecuComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    RouterModule,
    CoreModule,
    FormsModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class SessionVenteModule { }
