import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CoreModule } from '../core/core.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { VentesComponent } from './ventes/ventes.component';
import { DepensesComponent } from './depenses/depenses.component';
import { ProduitsComponent } from './produits/produits.component';
import { ClientsComponent } from './clients/clients.component';
import { RentabiliteModule } from "../rentabilite/rentabilite.module";

@NgModule({
  declarations: [
    AnalyticsComponent,
    VentesComponent,
    DepensesComponent,
    ProduitsComponent,
    ClientsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    RentabiliteModule
]
})
export class AnalyticsModule { }
