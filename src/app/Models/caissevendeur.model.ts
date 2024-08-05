export class CaissesVendeur {
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

export class CodeResponsecaisse {
    code!:string
    message!:CaissesVendeur[]
}


export class CodeResponse {
    code!:string
    message!:CaissesVendeur[]
}

export class CodeResponseOneCaisseV{
    code!:string
    message!:CaissesVendeur
}