import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationSotckproduit,CodeResponse,CodeResponseNotification, GetNotification } from '../Models/notifications.stock.produit.model';
import { environment } from 'src/environnement/environnement.prod';
import { CodeResponseNotificationCommande, GetNotificationCommande } from '../Models/notifications_commandes';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  urigetnotificationStockProduit = "/v1/sudmarket/get/notificationsStockProduits"
  urideletenotificationStockProduit = "/v1/sudmarket/detele/notificationsStockProduits"
  uriupdatenotificationStockProduit = "/v1/sudmarket/update/notificationsStockProduits"
  urireadallnotificationStockProduit = "/v1/sudmarket/readall/notificationsStockProduits"
  urigetnoticationscommandes = "/v1/sudmarket/get/notifications_commandes"

  constructor(private http: HttpClient) { }

  getListNotifications(notification: GetNotification): Observable<CodeResponse>{
    return this.http.post<CodeResponse>(environment.apiUrl + this.urigetnotificationStockProduit, notification)
  }

  updateNotification(notification: NotificationSotckproduit){
    return this.http.put<CodeResponse>(environment.apiUrl + this.uriupdatenotificationStockProduit, notification)
  }

   updateNotifications(notifications: NotificationSotckproduit[]): Observable<any> {
    return this.http.put<CodeResponse>(environment.apiUrl + this.urireadallnotificationStockProduit, notifications)
   }

  deleteNotification(notification: NotificationSotckproduit) {
    return this.http.post<CodeResponse>(environment.apiUrl + this.urideletenotificationStockProduit, notification)
  }

  getListNotificationsCommandes(notification: GetNotificationCommande): Observable<CodeResponseNotificationCommande>{
    return this.http.post<CodeResponseNotificationCommande>(environment.apiUrl + this.urigetnoticationscommandes, notification)
  }
}
