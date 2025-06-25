export class ArticlesDeVentes {
  article_de_vente_id!: number;
  point_de_vente_id?: number; 
  vente_id!: number;
  produit_id!: number;
  quantite!: number;
  prix_unitaire!: number;
  remise!: number;
  benefice!: number;
  prix_total_vente?: any;
  prix_de_revient!: number
  id?: number
  combination_hash?: any
  date_article_vendu?: any
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
