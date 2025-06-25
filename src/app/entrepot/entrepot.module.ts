import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrepotComponent } from './entrepot/entrepot.component';
import { EntrepotFormComponent } from './entrepot-form/entrepot-form.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CoreModule } from '../core/core.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EntrepotFicheComponent } from './entrepot-fiche/entrepot-fiche.component';
import { StockEntrepotsComponent } from './stock-entrepots/stock-entrepots.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { StockProduitsVariablesEntrepotsComponent } from './stock-produits-variables-entrepots/stock-produits-variables-entrepots.component';
import { ListProductEntrepotsComponent } from './list-product-entrepots/list-product-entrepots.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { InventairesComponent } from './inventaires/inventaires.component';
import { InventairesFormComponent } from './inventaires-form/inventaires-form.component';
import { TransfertStockEntrepotPointDeVenteComponent } from './transfert-stock-entrepot-point-de-vente/transfert-stock-entrepot-point-de-vente.component';
import { VariationByIdComponent } from './variation-by-id/variation-by-id.component';
import { MouvementStockComponent } from './mouvement-stock/mouvement-stock.component';
import { ListStockPointDeVenteComponent } from './list-stock-point-de-vente/list-stock-point-de-vente.component';
import { EntrepotSettingsComponent } from './entrepot-settings/entrepot-settings.component';

@NgModule({
  declarations: [
    EntrepotComponent,
    EntrepotFormComponent,
    EntrepotFicheComponent,
    StockEntrepotsComponent,
    StockProduitsVariablesEntrepotsComponent,
    ListProductEntrepotsComponent,
    InventairesComponent,
    InventairesFormComponent,
    TransfertStockEntrepotPointDeVenteComponent,
    VariationByIdComponent,
    MouvementStockComponent,
    ListStockPointDeVenteComponent,
    EntrepotSettingsComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterModule,
    MatPaginatorModule,
    CoreModule,
    MatTableModule,
    FormsModule
  ]
})
export class EntrepotModule { }
