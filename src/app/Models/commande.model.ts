
export class CommandeAchat {
    commande_achat_id!: number;
    point_de_vente_id?: number; 
    fournisseur_id!: number;
    entrepot_id?: number
    date_commande?: string;
    montant_total!: number;
    statut?: string;
    statut_validation?: string
    utilisateur_id!: number;
    articles?: ArticlesDeCommandeDAchat[];

}

export class ArticlesDeCommandeDAchat {
    article_commande_achat_id!: number;
    commande_achat_id!: number;
    produit_id!: number;
    quantite!: number;
    prix_unitaire!: number;
    prix_total_commande!: number
}


export class GetCommandeAchat {
    commande_achat_id!: number;
}

export class CodeResponse {
    code!:string
    message!:CommandeAchat[]
    commande_achat_id!: number
}

export class CodeResponseOneCommandeAchat{
    code!:string
    message!:CommandeAchat
}