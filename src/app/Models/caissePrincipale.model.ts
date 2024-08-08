
export class CaissePrincipale {
    caisse_principale_id!: number; 
    banque_id!: number
    nom_caisse!:  string;
    montant_debit!: number;
    montant_credit!: number;
    description!: string; 
    solde!: number;
    cree_le!: Date; 
    mis_a_jour_le!: Date; 
  }
  
  export class GetCaissePrincipale {
    caisse_principale_id!: number;
}

export class CodeResponseP {
    code!:string
    message!:CaissePrincipale[]
}

export class CodeResponseOneCaissePrincipale{
    code!:string
    message!:CaissePrincipale
}