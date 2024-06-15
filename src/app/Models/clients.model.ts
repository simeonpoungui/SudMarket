export class Client {
    client_id!: number;
    nom!: string;
    prenom!: string;
    email!: string;
    telephone!: string;
    adresse!: string;
    sexe!: string;
    nationalite!: string;
    cree_le!: Date;
}

export class GetClient {
    client_id!: number;
}

export class CodeResponse {
    code!:string
    message!:Client[]
}

export class CodeResponseOneClient{
    code!:string
    message!:Client
}