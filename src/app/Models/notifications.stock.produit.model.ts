export class NotificationSotckproduit {
    notification_id?: number;
    produit_id!: number;
    message!: string;
    date_notification!: string;
    est_lu!: boolean;
    statut!: string
    point_de_vente_id!: number;
}

export class GetNotification {
    notification_id!: number;
}

export class CodeResponse {
    code!: string;
    message!: NotificationSotckproduit[];
}

export class CodeResponseNotification {
    code!: string;
    message!: NotificationSotckproduit;
}
