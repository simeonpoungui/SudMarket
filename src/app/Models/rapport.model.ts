export class Rapport {
    rapport_id!: number;
    type_rapport!: string;
    genere_le!: Date;
    modifie_le!: Date
    donnees!: string;
    nom_generateur!: string
}

export class GetRapport {
    rapport_id!: number;
}

export class CodeResponse {
    code!:string
    message!:Rapport[]
}

export class CodeResponseOneRapport{
    code!:string
    message!:Rapport
}