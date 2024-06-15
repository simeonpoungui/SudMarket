
export class CommandeAchat {
    commande_achat_id!: number;
    fournisseur_id!: number;
    date_commande!: Date;
    montant_total!: number;
    statut!: string;
    utilisateur_id!: number;
}

export class GetCommandeAchat {
    utilisateur_id!: number;
}

export class CodeResponse {
    code!:string
    message!:CommandeAchat[]
}

export class CodeResponseOneCommandeAchat{
    code!:string
    message!:CommandeAchat
}