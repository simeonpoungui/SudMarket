export class Session {
    session_id!: number;
    point_de_vente_id?: number; 
    user_id!: number;
    start_time!: Date;
    end_time?: Date;
    statut?: string
}

export class GetSession {
    session_id!: number;
}

export class CodeResponse {
    code!: string;
    message!: Session[];
}

export class CodeResponseOneSession {
    code!: string;
    detail!: Session;
    message!: string;
}
