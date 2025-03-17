export class PointsDeVentes {
    point_de_vente_id!: number;
    nom!: string;
    adresse!: string;
    ville!: string;
    code_postal!: string;
    pays!: string;
    telephone!: string;
    boutique_id?: number
    email!: string;
    responsable!: string;
    date_creation!: string;
    entrepot_id?: number
    date_modification!: string;
}

export class GetPointsDeVentes {
    point_de_vente_id?: number;
}

export class CodeResponse {
    code!:string
    message!:PointsDeVentes[]
}

export class CodeResponseOnePointDeVente{
    code!:string
    message!:PointsDeVentes
}