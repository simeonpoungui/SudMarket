export class Produit {
    produit_id!: number;
    nom!: string;
    description!: string;
    categorie!: string;
    prix!: number;
    quantite_en_stock!: number;
    niveau_de_reapprovisionnement!: number;
    cree_le!: Date;
    mis_a_jour_le!: Date;
}

export class GetProduit {
    produit_id!: number;
}

export class CodeResponse {
    code!:string
    message!:Produit[]
}

export class CodeResponseOneProduit{
    code!:string
    message!:Produit
}