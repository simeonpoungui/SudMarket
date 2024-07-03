export class ArticlesDeCommandeDAchat {
    article_commande_achat_id!: number;
    commande_achat_id!: number;
    produit_id!: number;
    quantite!: number;
    prix_unitaire!: number;
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
