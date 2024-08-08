export class Banque {
    banque_id!: number;
    nom_banque!: string;
    numero_compte!: string;
    ville!: string;
    adresse!: string;
    telephone!: string;
    solde!: number;
    date_creation!: Date;
    date_mise_a_jour!: Date;
}

export class GetBanque {
    banque_id!: number;
}

export class CodeResponse {
    code!: string;
    message!: Banque[];
}

export class CodeResponseOneBanque {
    code!: string;
    message!: Banque;
}