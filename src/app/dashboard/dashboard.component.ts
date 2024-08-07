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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  pointSelected!: PointsDeVentes;
  pointStorage!: any;
  ventes!: Vente[]

  constructor(
    private loginService: LoginService,
    private dialog: MatDialog,
    public globalService: GlobalService,
    private venteService: VenteService,
    private notificationService: NotificationsService,
    private router: Router
  ) {}

  notifications: NotificationSotckproduit[] = [];
  unreadCount: number = 0;

  ngOnInit(): void {
    this.loadNotifications();
    this.getListVente()
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

 openPointsDeVentes() {
    const storedPointSelected = localStorage.getItem('pointSelected');
    if (storedPointSelected) {
      localStorage.removeItem('pointSelected');
      console.log('PointSelected exists and has been removed.');
    } else {
      console.log('PointSelected does not exist.');
    }
    const dialog = this.dialog.open(SelectPointDeVenteComponent);
    dialog.afterClosed().subscribe((result) => {
      this.pointSelected = dialog.componentInstance.pointSelected;
      console.log(this.pointSelected);
      localStorage.setItem('pointSelected', JSON.stringify(this.pointSelected));
      // window.location.reload()
      this.router.navigateByUrl('/session-vente');
    });
  }

  openPointsDeVentesCommande(){
    const storedPointSelected = localStorage.getItem('pointSelectedCommande');
    if (storedPointSelected) {
      localStorage.removeItem('pointSelectedCommande');
      console.log('PointSelected exists and has been removed.');
    } else {
      console.log('PointSelected does not exist.');
    }
    const dialog = this.dialog.open(SelectPointDeVenteComponent);
    dialog.afterClosed().subscribe((result) => {
      this.pointSelected = dialog.componentInstance.pointSelected;
      console.log(this.pointSelected);
      localStorage.setItem('pointSelectedCommande', JSON.stringify(this.pointSelected));
      this.router.navigateByUrl('/session-commande-achat');
    }); 
  }
}
