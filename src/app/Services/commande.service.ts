import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environnement/environnement.prod';
import {
  CodeResponse,
  CodeResponseOneCommandeAchat,
  CommandeAchat,
  GetCommandeAchat,
} from '../Models/commande.model';
import { GetPaiement, Paiement } from '../Models/paiement.commande.model';

@Injectable({
  providedIn: 'root',
})
export class CommandeService {
  uriget = '/v1/sudmarket/get/commandes-achats';
  uricreate = '/v1/sudmarket/create/commandes-achats';
  uridelete = '/v1/sudmarket/delete/commandes-achats';
  uriupdate = '/v1/sudmarket/update/commandes-achats';
  urifiltrescommandes = '/v1/sudmarket/get/filtre/commandes/achats';
  uriimprimecommandesachats = "/v1/sudmarket/impression/commandes/achats"
  uriupdatestockproduitbystatut = "/v1/sudmarket/update/produits/by-commandes"
  urigetarticlecommandebycommandeid = "/v1/sudmarket/get/filtre/articles-de-commande-by-commandeID"
  urietatcommendeachat = "/v1/sudmarket/etat/commandes-achats"

  uripaiementcommande = "/v1/sudmarket/add/paiement-commande"
  urigetpaiement = "/v1/sudmarket/get/paiement-commande"

  uricreatefacturecommande = "/v1/sudmarket/create/facture-commande"
  uricreatebondelivraison = "/v1/sudmarket/create/bon_de_livraison-commande"
  urigetfacturecommande = "/v1/sudmarket/get/facture-commande"
  urigetbondelivraison = "/v1/sudmarket/get/bon_de_livraison-commande"

  constructor(private httpclient: HttpClient) {}

  getList(commande: GetCommandeAchat): Observable<CodeResponse> {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uriget,
      commande
    );
  }

  getOne(commande: GetCommandeAchat): Observable<CodeResponseOneCommandeAchat> {
    return this.httpclient.post<CodeResponseOneCommandeAchat>(
      environment.apiUrl + this.uriget,
      commande
    );
  }
  delete(commande: CommandeAchat) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uridelete,
      commande
    );
  }
  update(commande: CommandeAchat) {
    return this.httpclient.put<CodeResponse>(
      environment.apiUrl + this.uriupdate,
      commande
    );
  }

  etatcommandeAchat(commande: GetCommandeAchat): Observable<Blob> {
    console.log(commande)
    return this.httpclient.post( environment.apiUrl + this.urietatcommendeachat, commande, { responseType: 'blob' });
  }

  create(commande: CommandeAchat) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uricreate,
      commande
    );
  }

  getArticleCommandeByCommandeID(commande: GetCommandeAchat) {
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.urigetarticlecommandebycommandeid,
      commande
    );
  }

  updaStatutteProduitStockBySatut(commande: GetCommandeAchat) {
    console.log(commande);
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.uriupdatestockproduitbystatut,
      commande
    );
  }


  getListFiltreCommandes(
IDfournisseur: number, IDuser: number, IDpointVente: number, DateDebut: string, DateFin: string ) {
    const data = {
      fournisseur_id: IDfournisseur,
      utilisateur_id: IDuser,
      point_de_vente_id: IDpointVente,
      DateDebut: DateDebut,
      DateFin: DateFin,
    };
    console.log(data);
    return this.httpclient.post<CodeResponse>(
      environment.apiUrl + this.urifiltrescommandes,
      data
    );
  }


  getListCommandesPDF(data: CommandeAchat[]): Observable<any> {
    console.log(environment.apiUrl + this.uriimprimecommandesachats);
    return this.httpclient.post(environment.apiUrl + this.uriimprimecommandesachats, data , {
      responseType: 'blob' as 'json'
    });
  }

  // Paiement Commande

  AddpaiementCommande(paiement: Paiement) {
    return this.httpclient.post<any>(environment.apiUrl + this.uripaiementcommande,paiement);
  }

  getListPaiement(paiement: GetPaiement): Observable<any> {
    return this.httpclient.post<any>(
      environment.apiUrl + this.urigetpaiement,
      paiement
    );
  }



    // Fonction pour insérer la facture
    insertFacture(facture: { commande_achat_id: number, utilisateur_id: number, pdf_path: string }): Observable<CodeResponse> {
      return this.httpclient.post<CodeResponse>(
        environment.apiUrl + this.uricreatefacturecommande,
        facture
      );
    }
  
    // Fonction pour insérer le bon de livraison
    insertBonLivraison(bonDeLivraison: { commande_achat_id: number, pdf_path: string }): Observable<CodeResponse> {
      return this.httpclient.post<CodeResponse>(
        environment.apiUrl + this.uricreatebondelivraison,
        bonDeLivraison
      );
    }

    getOneBonLivraison(commande_achat_id: number): Observable<any> {
      const data = {
        commande_achat_id: commande_achat_id
      }
      return this.httpclient.post<any>(
        environment.apiUrl + this.urigetbondelivraison,
        data
      );
    }

    getOneFacture(commande_achat_id: number): Observable<any> {
      const data = {
        commande_achat_id: commande_achat_id
      }
      return this.httpclient.post<any>(
        environment.apiUrl + this.urigetfacturecommande,
        data
      );
    }
  
}
