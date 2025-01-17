export class Utilisateur {
    utilisateur_id!: number;
    point_de_vente_id?: number; 
    nom_utilisateur!: string;
    prenom_utilisateur?: string;
    mot_de_passe_hash!: string;
    email?: string;
    telephone?: string;
    sexe?: string;
    adresse?: string;
    nationalite?: string;
    date_de_naissance?: string;
    role!: string;
    cree_le?: Date;
    mis_a_jour_le?: Date;
    ventes?: number;
    produits?: number;
    stock?: number;
    analytics?: number;
    commandes?: number
}


export class ImageUser {
    utilisateur_id!: number;
    image: any | ArrayBuffer | null = null;
}

export class GetUser {
    utilisateur_id!: number;
}

export class CodeResponse {
    code!:string
    message!:Utilisateur[]
}

export class CodeResponseOneUser{
    code!:string
    message!:Utilisateur
}