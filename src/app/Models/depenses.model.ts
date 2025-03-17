export class Depense {
    id_depense!: number;
    date_heure!: string;
    categorie_depense!: string;
    montant!: number;
    employe_responsable!: number;
    note_additionnelle?: string;
    fournisseur!: string;
    point_de_vente_id!: number;
}

export class GetDepense {
    id_depense!: number;
}

export class CodeResponseDepense {
    code!: string;
    message!: Depense[];
}

export class CodeResponseOneDepense {
    code!: string;
    message!: Depense;
}
