export class Categorie {
    categorie_id!: number;
    nom!: string;
    description!: string;
}

export class GetCategorie {
    categorie_id!: number;
}

export class CodeResponseCategorie{
    code!: string;
    message!: Categorie[];
}

export class CodeResponseOneCategorie {
    code!: string;
    message!: Categorie;
}
