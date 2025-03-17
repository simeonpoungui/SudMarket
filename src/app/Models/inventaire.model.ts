export class Inventaire {
    id!: number;
    produit_id!: number;
    entrepot_id!: number;
    quantite_comptee!: number;
    quantite_initiale!: number;
    date_inventaire!: Date;
    utilisateur_id!: number;
    ecart!: number;
    motif!: string;
    action_recommande!: string;
    type_produit!: string;
    variation_id!: number;
    commentaire!: string
    combination_hash!: string;
}

export class GetInventaire {
    id!: number;
}

export class CodeResponseInventaire {
    code!: string;
    message!: Inventaire[];
}

export class CodeResponseOneInventaire {
    code!: string;
    message!: Inventaire;
}
