export class CaisseVendeur {
    caisse_vendeur_id!: number;
    nom_caisse!: string;
    point_de_vente_id!: number;
    utilisateur_id!: number;
    solde_caisse!: number;
    date_creation!: Date;
    date_mise_a_jour!: Date;
    actif!: boolean;
}

export class GetCaisseVendeur {
    caisse_vendeur_id!: number;
}

export class HistoriqueCaisseVendeur {
    historique_caisse_id!: number
    caisse_vendeur_id!: number
    date_comptable!: Date
    solde_ouverture!: string
    solde_fermeture!: string
    TotalRetraits!: string
    TotalVersements!: string
    solde_confirme!: boolean
    commentaires!: string
}

export class CodeResponseHistorique{
    code!:string
    message!:HistoriqueCaisseVendeur
}


