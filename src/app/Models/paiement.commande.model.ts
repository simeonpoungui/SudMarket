export class Paiement {
    paiement_id!: number;
    commande_achat_id!: number;
    montant!: number;
    date_paiement!: Date;
    mode_paiement!: string;
    utilisateur_id?: number
    point_de_vente_id?: number
}

export class GetPaiement {
    paiement_id!: number;
}

export class CodeResponsePaiement {
    code!: string;
    message!: Paiement[];
}

export class CodeResponseOnePaiement {
    code!: string;
    message!: Paiement;
}
