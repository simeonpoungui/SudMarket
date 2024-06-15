export class Rapport {
    rapport_id!: number;
    type_rapport!: string;
    genere_le!: Date;
    donnees!: string;
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