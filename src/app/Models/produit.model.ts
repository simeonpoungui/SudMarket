export class Produit {
    produit_id!: number;
    point_de_vente_id?: number; 
    code_produit?: string
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

export class ImageProduit {
    produit_id!: number;
    image: any | ArrayBuffer | null = null;
}

export class CodeResponse {
    code!:string
    message!:Produit[]
}

export class CodeResponseOneProduit{
    code!:string
    message!:Produit
}