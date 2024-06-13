export class Role {
    role_id!: number;
    nom_role!: string;
    permissions!: string[];
  }
  
  export class GetRole {
    role_id!: number;
}

export class CodeResponse {
    code!:string
    message!:Role[]
}

export class CodeResponseRole{
    code!:string
    message!:Role
}