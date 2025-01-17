export class NotificationCommande {
    notification_id?: number;
    commande_achat_id!: number;  // ID de la commande d'achat liée à la notification
    utilisateur_id!: number;     // ID de l'utilisateur qui reçoit la notification
    type_notification!: string;  // Type de notification (par exemple, "Commande Validée", "Commande Annulée", etc.)
    message!: string;            // Le message de la notification
    statut_notification!: string; // Statut de la notification (ex. "Lu", "Non Lu")
    date_notification!: string;  // Date de la notification
}

export class GetNotificationCommande {
    notification_id!: number;  // ID de la notification que l'on veut récupérer
}

export class CodeResponseNotificationCommande {
    code!: string;              // Code de réponse (par exemple "200" ou "500")
    message!: NotificationCommande[];  // Liste des notifications de commande
}

export class CodeResponseNotificationCommandeUnique {
    code!: string;              // Code de réponse (par exemple "200" ou "500")
    message!: NotificationCommande;  // Une seule notification de commande
}
