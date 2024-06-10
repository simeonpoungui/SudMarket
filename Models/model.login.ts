export class Login {
    email!: string
    mot_de_passe_hash!: string
}

export class CodeResponse {
    code!:string
    message!:Login[]
}