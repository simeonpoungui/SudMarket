export class PointsDeVentes {
    point_de_vente_id!: number;
    nom!: string;
    adresse!: string;
    ville!: string;
    codePostal!: string;
    pays!: string;
    telephone!: string;
    email!: string;
    responsable!: string;
    dateCreation!: Date;
    dateModification!: Date;
}

export class GetPointsDeVentes {
    point_de_vente_id!: number;
}

export class CodeResponse {
    code!:string
    message!:PointsDeVentes[]
}

export class CodeResponseOnePointDeVente{
    code!:string
    message!:PointsDeVentes
}