import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CaissesService } from 'src/app/Services/caisses.service';
import { GetCaisseVendeur } from 'src/app/Models/caissevendeur.model';
import { CaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
import { GlobalService } from 'src/app/Services/global.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { UsersService } from 'src/app/Services/users.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
@Component({
  selector: 'app-caisse-vendeur',
  templateUrl: './caisse-vendeur.component.html',
  styleUrls: ['./caisse-vendeur.component.scss']
})
export class CaisseVendeurComponent {
  dataSource!: any;
  isloadingpage!: boolean;
  selectCaisseVendeur!: string;
  displayedColumns = [
    'nom_caisse',
    'point_de_vente_id',
    'utilisateur_id',
    'solde_caisse',
    'date_mise_a_jour',
    'actif',
    'Actions'
  ];

  DateDebut!: string;
  DateFin!: string;
  caisse_vendeur_id!: number;
  tbcaisse!: CaisseVendeur[];
  tbPointdeVente!: PointsDeVentes[];
  tbUsers!: Utilisateur[]

  constructor(
    public globalService: GlobalService,
    private dialog: MatDialog,
    private userService: UsersService,
    private pointService: PointsDeVentesService,
    private caisseSerices: CaissesService,
    private router: Router
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListCaissesVendeur();
  }
  getListCaissesVendeur() {
    const caisse: GetCaisseVendeur = {
      caisse_vendeur_id: 0,
    };
    this.caisseSerices.getListCaisseVendeur(caisse).subscribe((data) => {
      console.log(data.message);
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.tbcaisse = data.message;
    });

    this.loadPointDeVente();
    this.loadUser()
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  loadUser() {
    const user: GetUser = { utilisateur_id: 0 };
    this.userService.getListUser(user).subscribe((data) => {
      console.log(data.message);
      this.tbUsers = data.message;
    });
  }


  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(
      (p) => p.point_de_vente_id === point_de_vente_id
    );
    return point ? point.nom : 'Unknown Point';
  }

  getUserName(utilisateur_id: any): string {
    const user = this.tbUsers.find(
      (u) => u.utilisateur_id === utilisateur_id
    );
    return user ? user.nom_utilisateur : 'Unknown User';
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  actions(element: CaisseVendeur) {
    this.selectCaisseVendeur = JSON.stringify(element);
    localStorage.setItem('selectedCaisseVendeur', this.selectCaisseVendeur);
    if (this.selectCaisseVendeur) {
      this.router.navigateByUrl('caisse-vendeur-fiche');
    }
  }

}
