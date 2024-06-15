export class Fournisseur {
    fournisseur_id!: number;
    nom!: string;
    prenom!: string;
    sexe!: string;
    personne_de_contact!: string;
    email!: string;
    telephone!: string;
    adresse!: string;
    cree_le!: Date;
}

export class GetFournisseur{
    utilisateur_id!: number;
}

export class CodeResponse {
    code!:string
    message!:Fournisseur[]
}

export class CodeResponseOneFournisseur{
    code!:string
    message!:Fournisseur
}