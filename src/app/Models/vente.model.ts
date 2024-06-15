
export class Vente {
    vente_id!: number;
    date_vente!: Date;
    montant_total!: number;
    client_id!: number;
    utilisateur_id!: number;
}  

export class GetVente {
    vente_id!: number;
}

export class CodeResponse {
    code!:string
    message!:Vente[]
}

export class CodeResponseOneVente{
    code!:string
    message!:Vente
}