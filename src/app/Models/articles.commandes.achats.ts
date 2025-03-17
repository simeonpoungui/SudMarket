export class ArticlesDeCommandeDAchat {
    id?: number
    article_commande_achat_id!: number;
    entrepot_id?: number
    commande_achat_id!: number;
    point_de_vente_id?: number; 
    produit_id!: number;
    quantite!: number;
    date_commande?: string
    prix_unitaire!: number;
    prix_achat!: number
    prix_total_commande!: number
}


export class GetArticleDeCommandeDAchat {
    article_commande_achat_id!: number;
}

export class CodeResponse {
    code!: string;
    message!: ArticlesDeCommandeDAchat[];
}

export class CodeResponseOneArticleDeCommandeDAchat {
    code!: string;
    message!: ArticlesDeCommandeDAchat;
}
