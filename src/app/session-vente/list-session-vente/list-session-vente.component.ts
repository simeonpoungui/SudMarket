import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SessionService } from 'src/app/Services/session.service';
import { GetSession } from 'src/app/Models/session.ventes.model';
import { Client } from 'src/app/Models/clients.model';
import { UsersService } from 'src/app/Services/users.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-list-session-vente',
  templateUrl: './list-session-vente.component.html',
  styleUrls: ['./list-session-vente.component.scss']
})
export class ListSessionVenteComponent {
  dataSource!: any
  isloadingpage!: boolean
  tbUsers: Utilisateur[] = []
  displayedColumns = [
    'user_id',
    'solde_ouverture',
    'solde_fermeture',
    'montant_total_vendu',
    'start_time',
    'end_time',
    'statut'
  ];
  constructor(
    private sessionServicve: SessionService,
    private dialog: MatDialog,
    private userService: UsersService,
    public globalService: GlobalService
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    this.getListSessions()
    this.loadUsers()
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

  getListSessions(){
    this.isloadingpage = true
    const session: GetSession = {
      session_id: 0,
    }
    this.sessionServicve.getListSessions(session).subscribe(data => {
      console.log(data);
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
