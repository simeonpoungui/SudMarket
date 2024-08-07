import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { RoleComponent } from './role/role.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CoreModule } from '../core/core.module';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { FicheRoleComponent } from './role/fiche-role/fiche-role.component';
import { PointsDeVentesComponent } from './points-de-ventes/points-de-ventes.component';
import { NotificationsStockProduitsComponent } from './notifications-stock-produits/notifications-stock-produits.component';
import { SelectPointDeVenteComponent } from './points-de-ventes/select-point-de-vente/select-point-de-vente.component';
import { FichePointDeVenteComponent } from './points-de-ventes/fiche-point-de-vente/fiche-point-de-vente.component';
import { FichePointDeVenteFormComponent } from './points-de-ventes/fiche-point-de-vente-form/fiche-point-de-vente-form.component';
@NgModule({
  declarations: [
    SettingsComponent,
    RoleComponent,
    RoleFormComponent,
    FichePointDeVenteComponent,
    FicheRoleComponent,
    FichePointDeVenteFormComponent,
    PointsDeVentesComponent,
    NotificationsStockProduitsComponent,
    SelectPointDeVenteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CoreModule,
    MatTableModule,
    MatPaginatorModule,
    MatTableModule
  ]
})
export class SettingsModule { }
