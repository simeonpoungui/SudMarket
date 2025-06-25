import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SessionService } from 'src/app/Services/session.service';
import { GetSession } from 'src/app/Models/session.ventes.model';
import { Client } from 'src/app/Models/clients.model';
import { UsersService } from 'src/app/Services/users.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { GlobalService } from 'src/app/Services/global.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-historique-session-by-point-de-vente',
  templateUrl: './historique-session-by-point-de-vente.component.html',
  styleUrls: ['./historique-session-by-point-de-vente.component.scss']
})
export class HistoriqueSessionByPointDeVenteComponent {
  dataSource!: any
  isloadingpage!: boolean
  tbUsers: Utilisateur[] = []
  tbPointdeVente!: PointsDeVentes[]

  displayedColumns = [
    'session_id',
    'point_de_vente_id',
    'user_id',
    'start_time',
    'end_time',
    'solde_ouverture',
    'solde_fermeture',
    'statut'
  ];

  point_de_vente_id!: number

  constructor(
    private sessionServicve: SessionService,
    private dialog: MatDialog,
    private pointService: PointsDeVentesService,
    private userService: UsersService,
    private route: ActivatedRoute,
    public globalService: GlobalService
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    const point_de_vente_id = this.route.snapshot.params['id']
    this.point_de_vente_id = Number(point_de_vente_id)
    console.log(this.point_de_vente_id);
    

    this.loadPointDeVente()
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

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      
    } )
  }

  getUserName(utilisateur_id: number): string {
    const user = this.tbUsers.find(u => u.utilisateur_id === utilisateur_id);
    return user ? user.nom_utilisateur + ' ' + user.prenom_utilisateur : 'Unknown User';
  }
  getPointName(point_de_vente_id: number): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }
  getListSessions(){
    this.isloadingpage = true
    const session: GetPointsDeVentes = {
      point_de_vente_id: this.point_de_vente_id,
    }
    this.sessionServicve.getHistoriqueSessionsByPointDeVente(session).subscribe(data => {
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
