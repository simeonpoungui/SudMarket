export class Boutique {
    boutique_id!: number;
    nom!: string;
    adresse!: string;
    telephone!: string;
    responsable!: string;
    logo!: string;
    date_creation!: Date;
}

export class GetBoutique {
    boutique_id!: number;
}

export class CodeResponseBoutique {
    code!: string;
    message!: Boutique[];
}

export class CodeResponseOneBoutique {
    code!: string;
    message!: Boutique;
}
