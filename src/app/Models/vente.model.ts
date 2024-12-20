
export class Vente {
    vente_id!: number;
    session_id?: number
    montant_total!: number;
    client_id!: number;
    point_de_vente_id!: number
    utilisateur_id!: number;
    mode_de_paiement!: string
    date_vente?: any
    caisse_vendeur_id!: number
    total_benefice_vente!: number
    note?: string
    articles!: ArticlesDeVentes[];
}  

export class VenteArticle {
  vente_id!: number;
  montant_total!: number;
  client_id!: number;
  date_vente!: string;
  utilisateur_id!: number;
  articles!: ArticlesDeVentes[];

}

export class ArticlesDeVentes {
  article_de_vente_id!: number;
  point_de_vente_id?: number; 
  vente_id!: number;
  produit_id!: number;
  quantite!: number;
  prix_unitaire!: number;
  date_article_vendu?: string
  remise!: number;
  benefice!: number;
  prix_total_vente?: any;
  prix_de_revient!: number
}

export class GetVente {
    vente_id!: number;
}

export class CodeResponse {
    code!:string
    message!:Vente[]
    facture!: Facture
}

export class Facture {
  facture_id!: number;
  vente_id!: number;
  numero_facture!: string;
  date_facture!: Date;
  montant_total!: number;
  mode_de_paiement!: string;
  utilisateur_id?: number
  client_id!: number;
  client_nom?: string;  
}


export class CodeResponseOneVente{
    code!:string
    message!:Vente
}