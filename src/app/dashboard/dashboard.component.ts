import { Component } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { PointsDeVentesComponent } from '../settings/points-de-ventes/points-de-ventes.component';
import { PointsDeVentes } from '../Models/pointsDeVentes.model';
import { Router } from '@angular/router';
import { NotificationsService } from '../Services/notifications.service';
import { GetNotification, NotificationSotckproduit } from '../Models/notifications.stock.produit.model';
import { GlobalService } from '../Services/global.service';
import { SelectPointDeVenteComponent } from 'src/app/settings/points-de-ventes/select-point-de-vente/select-point-de-vente.component';
import { VenteService } from '../Services/vente.service';
import { GetVente, Vente } from '../Models/vente.model';
import { EtatCaisseVendeurComponent } from '../comptabilite/etat-caisse-vendeur/etat-caisse-vendeur.component';
import { BoutiqueService } from '../Services/boutique.service';
import { GetUser, Utilisateur } from '../Models/users.model';
import { UsersService } from '../Services/users.service';
import { GetNotificationCommande, NotificationCommande } from '../Models/notifications_commandes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  pointSelected!: PointsDeVentes;
  pointStorage!: any;
  ventes!: Vente[]
  user!: Utilisateur
  logo: string = " "
  imageUserConnected!: Utilisateur[]

  constructor(
    private loginService: LoginService,
    private dialog: MatDialog,
    private boutiqueService: BoutiqueService,
    public globalService: GlobalService,
    private venteService: VenteService,
    private notificationService: NotificationsService,
    private router: Router,
    private userService: UsersService
  ) {}

  notifications: NotificationSotckproduit[] = [];
  notificationscommandes: NotificationCommande[] = [];  // Liste des notifications

  unreadCount: number = 0;
  unreadCountcommande: number = 0

  ngOnInit(): void {
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
      console.log(this.user);
      this.loadOneBoutiqueByUserCoonected()
    }
    this.loadNotifications();
    this.getListVente()
    this.getImageUserID()
    this.getListNotificationsCommandes()
  }



  loadOneBoutiqueByUserCoonected(){
    this.boutiqueService.getBoutiqueByPointDeVente(this.user.point_de_vente_id).subscribe(data => {
      console.log(data.message);
      this.logo = data.message.logo
      console.log(this.logo);
      
    })
  }

  getImageUserID(){
    const user: GetUser = {utilisateur_id: this.user.utilisateur_id}
    this.userService.getImageByUser(user).subscribe(data => {
      this.imageUserConnected = data.message
      console.log(this.imageUserConnected);
    })
  }

  getListVente(){
    const vente : GetVente = {vente_id: 0}
    this.venteService.getList(vente).subscribe(data => {
      console.log(data.message);
      this.ventes = data.message
     });
  }

  onLogout() {
    this.loginService.logout();
  }

  openCaisse(){
    const dialog = this.dialog.open(EtatCaisseVendeurComponent)
  }

  loadNotifications(): void {
    const modelnotif: GetNotification = {
      notification_id: 0,
    };
    this.notificationService.getListNotifications(modelnotif).subscribe(response => {
      this.notifications = response.message;
      this.unreadCount = this.notifications.filter(notification => !notification.est_lu).length;
    });
  }

  markAsRead(notification: NotificationSotckproduit): void {
    notification.est_lu = true;
    this.notificationService.updateNotification(notification).subscribe(() => {
      this.unreadCount = this.notifications.filter(notification => !notification.est_lu).length;
      console.log( this.unreadCount);
      
    });
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.est_lu = true;
    });
    this.notificationService.updateNotifications(this.notifications).subscribe(() => {
      this.unreadCount = 0;
    });
  }

  removeNotification(notification: NotificationSotckproduit): void {
    this.notifications = this.notifications.filter(n => n !== notification);
    this.notificationService.deleteNotification(notification).subscribe(() => {
      this.unreadCount = this.notifications.filter(notification => !notification.est_lu).length;
    });
  }


 // Méthode pour récupérer la liste des notifications
getListNotificationsCommandes() {
  const notification: GetNotificationCommande = {
    notification_id: 0
  };
  
  this.notificationService.getListNotificationsCommandes(notification).subscribe(res => {
    console.log(res.message);
    this.notificationscommandes = res.message;
    // Calculer le nombre de notifications non lues dès la réception des notifications
    this.unreadCountcommande = this.notificationscommandes.filter(n => n.statut_notification !== 'lu').length;
  });
}

// Marquer toutes les notifications comme lues
markAllAsReadCommandes(): void {
  // Marquer toutes les notifications comme lues
  this.notificationscommandes.forEach(notification => {
    notification.statut_notification = 'lu'; // On met à jour le statut
  });

  // Réinitialiser le compteur des notifications non lues
  this.unreadCountcommande = 0;
}

// Marquer une notification comme lue
markAsReadCommandes(notification: NotificationCommande): void {
  // Marquer la notification comme lue
  notification.statut_notification = 'lu'; 
  
  // Recalculer le nombre de notifications non lues
  this.unreadCountcommande = this.notificationscommandes.filter(n => n.statut_notification !== 'lu').length;
}

// Supprimer une notification
removeNotificationCommandes(notification: NotificationCommande): void {
  // Supprimer la notification de la liste
  const index = this.notificationscommandes.indexOf(notification);
  if (index > -1) {
    this.notificationscommandes.splice(index, 1);
  }

  // Recalculer le nombre de notifications non lues après suppression
  this.unreadCountcommande = this.notificationscommandes.filter(n => n.statut_notification !== 'lu').length;
}

  


}
