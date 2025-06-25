import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environnement/environnement.prod';
import {
  Entrepot,
  GetEntrepot,
  CodeResponse,
  CodeResponseOneEntrepot,
  ModelSendAddProductEntrepot,
} from '../Models/entrepot.model';
import {
  CodeResponseInventaire,
  CodeResponseOneInventaire,
  GetInventaire,
  Inventaire,
} from '../Models/inventaire.model';
import { modelSendStockPointVente } from '../Models/stock.point.de.vente.model';

@Injectable({
  providedIn: 'root',
})
export class EntrepotService {
  urigetlistentrepot = '/v1/sudmarket/get/entrepots';
  uricreateentrepot = '/v1/sudmarket/create/entrepots';
  urideleteentrepot = '/v1/sudmarket/delete/entrepots';
  uriupdateentrepot = '/v1/sudmarket/update/entrepots';
  uriimpressionetatentrepot = '/v1/sudmarket/impression/entrepots';
  uricreatestockentrepot = '/v1/sudmarket/create/stock/entrepots';
  urigetliststockentrepot = '/v1/sudmarket/list/stock/entrepots';
  urifiltrestock = '/v1/sudmarket/filtre/stock/entrepots';
  urifiltrestockbyentrepotid = '/v1/sudmarket/filtre/stock/by-entrepot-Id';
  uristockbyentrepotid = '/v1/sudmarket/get/stock/by-entrepot-Id';

  uriaddinventaire = '/v1/sudmarket/add/inventaire';
  urilistinventaire = '/v1/sudmarket/list/inventaires';
  uriupdateinventaire = '/v1/sudmarket/update/inventaires';

  uristockpointdevente = '/v1/sudmarket/transfert/stock/point/vente';
  urigetstockpointdevente = '/v1/sudmarket/get/stock/point/vente';
  uriflitrestockpointdevente = '/v1/sudmarket/filtre/stock/point/vente';
  urigeetquantiteproduitbystockpoint =
    '/v1/sudmarket/get/stock/produit/by-point-de-vente';

  urimouvementstock = '/v1/sudmarket/get/mouvementStock';
  urimouvementstockbyentrepot = '/v1/sudmarket/get/mouvementStock/byEntrepot';

  constructor(private httpclient: HttpClient) {}

  getListEntrepot(entrepot: GetEntrepot): Observable<CodeResponse> {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.urigetlistentrepot,
      entrepot
    );
  }

  getOneEntrepot(entrepot: GetEntrepot): Observable<CodeResponseOneEntrepot> {
    return this.httpclient.post<CodeResponseOneEntrepot>(
      environment.apiUrl + this.urigetlistentrepot,
      entrepot
    );
  }

  deleteEntrepot(entrepot: number) {
    const data = { entrepot_id: entrepot };
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.urideleteentrepot,
      data
    );
  }

  updateEntrepot(entrepot: Entrepot) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uriupdateentrepot,
      entrepot
    );
  }

  createEntrepot(entrepot: Entrepot) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uricreateentrepot,
      entrepot
    );
  }

  getListEntrepotPDF(): Observable<any> {
    return this.httpclient.get(
      environment.apiUrl + this.uriimpressionetatentrepot,
      {
        responseType: 'blob' as 'json',
      }
    );
  }

  // Stock create Entrepot
  StockcreateEntrepot(stockcreateentrepot: ModelSendAddProductEntrepot) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uricreatestockentrepot,
      stockcreateentrepot
    );
  }

  getListStockEntrepot(entrepot_id: number): Observable<CodeResponse> {
    const data = {
      id: entrepot_id,
    };
    console.log(data);
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.urigetliststockentrepot,
      data
    );
  }

  getListStockByEntrepotID(entrepot_id: number): Observable<CodeResponse> {
    const data = {
      entrepot_id: entrepot_id,
    };
    console.log(data);
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uristockbyentrepotid,
      data
    );
  }

  FiltreStockEntrepot(
    entrepot_id: number,
    produit_id: number,
    type_produit: string
  ) {
    const data = {
      entrepot_id: entrepot_id,
      produit_id: produit_id,
      type_produit: type_produit,
    };
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.urifiltrestock,
      data
    );
  }

  FiltreStockEntrepotID(entrepot_id?: number) {
    const data = {
      entrepot_id: entrepot_id,
    };
    console.log(data);

    return this.httpclient.post<any>(
      environment.apiUrl + this.urifiltrestockbyentrepotid,
      data
    );
  }

  // Inventaire
  AddInventaire(inventaire: Inventaire) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uriaddinventaire,
      inventaire
    );
  }

  getListInventaires(
    inventaire: GetInventaire
  ): Observable<CodeResponseInventaire> {
    return this.httpclient.post<CodeResponseInventaire>(
      environment.apiUrl + this.urilistinventaire,
      inventaire
    );
  }

  getOneInventaires(
    inventaire: GetInventaire
  ): Observable<CodeResponseOneInventaire> {
    return this.httpclient.post<CodeResponseOneInventaire>(
      environment.apiUrl + this.urilistinventaire,
      inventaire
    );
  }

  UpdateInventaire(inventaire: Inventaire) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uriupdateinventaire,
      inventaire
    );
  }

  // stock point de vente

  AddStockPointDeVente(stock: modelSendStockPointVente) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uristockpointdevente,
      stock
    );
  }

  getListStockPointDeVente(point_de_vente_id?: number) {
    const data = { point_de_vente_id: point_de_vente_id };
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.urigetstockpointdevente,
      data
    );
  }

  FiltreStockPointDeVente(
    entrepot_id: number,
    produit_id: number,
    type_produit: string,
    point_de_vente_id: number
  ) {
    const data = {
      entrepot_id: entrepot_id,
      produit_id: produit_id,
      type_produit: type_produit,
      point_de_vente_id: point_de_vente_id,
    };
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uriflitrestockpointdevente,
      data
    );
  }

  getQuantiteProduitByStockPoint(point_de_vente_id: any, produit_id: number) {
    const data = {
      point_de_vente_id: point_de_vente_id,
      produit_id: produit_id,
    };
    return this.httpclient.post<any>(
      environment.apiUrl + this.urigeetquantiteproduitbystockpoint,
      data
    );
  }

  // Mouvement Stock
  getListMouvement(id: number): Observable<any> {
    const data = { id: id };
    return this.httpclient.post<CodeResponseInventaire>(
      environment.apiUrl + this.urimouvementstock,
      id
    );
  }

  getListMouvementEntrepotID(id: number): Observable<any> {
    const data = { origine: id };
    return this.httpclient.post<CodeResponseInventaire>(
      environment.apiUrl + this.urimouvementstockbyentrepot,
      data
    );
  }
}
