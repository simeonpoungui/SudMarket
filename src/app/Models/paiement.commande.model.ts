export class Paiement {
    paiement_id!: number;
    commande_achat_id!: number;
    montant!: number;
    date_paiement!: Date;
    mode_paiement!: string;
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
