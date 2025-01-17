import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Component, ViewChild } from '@angular/core';
import { NotificationsService } from 'src/app/Services/notifications.service';
import { GlobalService } from 'src/app/Services/global.service';
import { GetNotificationCommande, NotificationCommande } from 'src/app/Models/notifications_commandes';
import { CommandeAchat } from 'src/app/Models/commande.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { UsersService } from 'src/app/Services/users.service';


@Component({
  selector: 'app-notifications-commandes',
  templateUrl: './notifications-commandes.component.html',
  styleUrls: ['./notifications-commandes.component.scss']
})
export class NotificationsCommandesComponent {
dataSource!: any
  isloadingpage!: boolean
  displayedColumns = [
    'commande_achat_id',
    'utilisateur_id',
    'type_notification',
    'statut_notification',
    'date_notification',
    'Actions'
  ];
    user!: Utilisateur
    tbUsers: Utilisateur[] = []

  constructor(
    private notificationServicve: NotificationsService,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private userService: UsersService,
    private router: Router
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
      console.log(this.user);
    }
    this.getListNotifications()
    this.loadUsers()
  }
  
  getListNotifications(){
    this.isloadingpage = true
    const notif: GetNotificationCommande = {
      notification_id: 0,
    }
    this.notificationServicve.getListNotificationsCommandes(notif).subscribe(data => {
      console.log(data);
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  loadUsers(){
    const user : GetUser = {utilisateur_id: 0}
    this.userService.getListUser(user).subscribe(data => {
      console.log(data);
      this.tbUsers = data.message
    })
  }

  getUserName(utilisateur_id: number): string {
    const user = this.tbUsers.find(u => u.utilisateur_id === utilisateur_id);
    return user ? user.nom_utilisateur + ' ' + user.prenom_utilisateur : 'Unknown User';
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  ViewCommande(element: CommandeAchat){
    this.router.navigateByUrl('commande/achat/edit' + '/' + element.commande_achat_id )
  }

}
