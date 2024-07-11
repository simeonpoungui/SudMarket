export class ArticlesDeVentes {
  article_de_vente_id!: number;
  point_de_vente_id?: number; 
  vente_id!: number;
  produit_id!: number;
  quantite!: number;
  prix_unitaire!: number;
  remise!: number;
  prix_total_vente?: any;
}

export class GetArticleDeVente {
  article_de_vente_id!: number;
}

export class CodeResponse {
  code!: string;
  message!: ArticlesDeVentes[];
}

export class CodeResponseOneArticle {
  code!: string;
  message!: ArticlesDeVentes;
}
