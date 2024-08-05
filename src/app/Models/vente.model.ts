
export class Vente {
    vente_id!: number;
    montant_total!: number;
    produit_id?: string
    client_id!: number;
    point_de_vente_id?: number
    utilisateur_id!: number;
    date_vente?: any
    caisse_vendeur_id?: number
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
  export interface ArticlesDeVentes {
    article_de_vente_id: number;
    vente_id: number;
    produit_id: number;
    quantite: number;
    prix_unitaire: number;
    prix_total_vente?: any;
    date_article_vendu?: string;
    remise: number;
  }

export class GetVente {
    vente_id!: number;
}

export class CodeResponse {
    code!:string
    message!:Vente[]
}

export class CodeResponseOneVente{
    code!:string
    message!:Vente
}