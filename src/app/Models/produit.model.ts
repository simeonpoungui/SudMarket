export class Produit {
    produit_id!: number;
    point_de_vente_id?: number;
    sku?: string;
    nom!: string;
    categorie_id!: number;
    prix!: number;
    prix_de_revient!: number;
    cout_d_achat!: number;
    quantite_en_stock!: number;
    niveau_de_reapprovisionnement!: number;
    description_courte?: string = '';
    description_longue?: string = '';
    type_produit?: string;
    cout_de_revient!: number
    prix_achat!: number
    prix_reduit?: number;
    unite_mesure?: string;
    code_barres?: string;
    hauteur?: number;
    etat_du_stock?: 'En stock' | 'Rupture de stock' | 'En réapprovisionnement';
    poids?: number; // en kg
    longueur?: number; // en cm
    largeur?: number; // en cm
    cree_le?: Date;
    mis_a_jour_le?: Date;
    TbVariations!: ProduitsVariante[];
    productCombinations: any[] = [];
}

export interface ProduitsVariante {
    nom: string;
    valeurs: Variations[]
  }
  
  export interface Variations{
    valeur: string;
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