import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { RoleComponent } from './role/role.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CoreModule } from '../core/core.module';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { FicheRoleComponent } from './role/fiche-role/fiche-role.component';
import { PointsDeVentesComponent } from './points-de-ventes/points-de-ventes.component';
import { NotificationsStockProduitsComponent } from './notifications-stock-produits/notifications-stock-produits.component';
import { SelectPointDeVenteComponent } from './points-de-ventes/select-point-de-vente/select-point-de-vente.component';
import { FichePointDeVenteComponent } from './points-de-ventes/fiche-point-de-vente/fiche-point-de-vente.component';
import { FichePointDeVenteFormComponent } from './points-de-ventes/fiche-point-de-vente-form/fiche-point-de-vente-form.component';
import { CategorieComponent } from './categorie/categorie.component';
import { CategorieFormComponent } from './categorie/categorie-form/categorie-form.component';
import { NotificationsCommandesComponent } from './notifications-commandes/notifications-commandes.component';
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
    SelectPointDeVenteComponent,
    CategorieComponent,
    CategorieFormComponent,
    NotificationsCommandesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CoreModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
  ]
})
export class SettingsModule { }
