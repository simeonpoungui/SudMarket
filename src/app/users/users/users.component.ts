import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/Services/users.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  dataSource!: any;
  displayedColumns = [
    'nom_utilisateur',
    'prenom_utilisateur',
    'email',
    'telephone',
    'sexe',
    // 'adresse',
    'nationalite',
    'role',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedUtilisateurString: string = ''
  tbPointdeVente!: PointsDeVentes[]
  users!: Utilisateur[]
  user!: Utilisateur

  nbreusers: number = 0

  constructor(
    private userService: UsersService,
    private router: Router,
    private pointService: PointsDeVentesService,
    private globalService: GlobalService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
      console.log(this.user);
    }
    this.getListUsers()
    this.loadPointDeVente()
  }

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      
    } )
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }
  getListUsers(){
    const user : GetUser = {utilisateur_id: 0}
    this.isloadingpage = true
    this.userService.getListUser(user).subscribe(data => {
      console.log(data.message);
      this.isloadingpage = false
      this.users = data.message
      this.nbreusers = data.message.length
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
    console.log(this.dataSource.filter);
    

    this.dataSource.filterPredicate = (data: Utilisateur, filter: string) => {
      const dataStr = Object.keys(data).reduce((currentTerm, key) => {
        return currentTerm + (data as { [key: string]: any })[key] + '◬';
      }, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };

 
    this.users = this.dataSource.filteredData;
    console.log(this.dataSource.filter);
    console.log(this.users);
  }


  actions(element: Utilisateur){
    if (this.user.role === "Vendeur" ) {
      this.globalService.toastShow("Vous n'avez pas le droit","Information",'info')
    }else{
      this.selectedUtilisateurString = JSON.stringify(element); 
      localStorage.setItem('selectedUtilisateur', this.selectedUtilisateurString);
      if (this.selectedUtilisateurString) {
        this.router.navigateByUrl('fiche/view')
      }
    }

  }

  SelectPointDeVente(event: any){
    console.log(event.target.value);
    const point : GetPointsDeVentes = {
      point_de_vente_id: Number(event.target.value)
    }
    this.userService.getUserByPointVente(point).subscribe(data => {
      this.users = data.message
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([])
        this.nbreusers = 0
        this.globalService.toastShow('Aucun utilisateur trouvé','Information','info')
      }else {
        this.dataSource = new MatTableDataSource(data.message);
        this.nbreusers = this.dataSource.data.length
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  imprimer() {
    this.userService.getListUsersPDF(this.users).subscribe((data) => {
      console.log(data);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Rapport_de_cloture_de_caisse.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      const pdfWindow = window.open('');
      if (pdfWindow) {
        pdfWindow.document.write(
          "<iframe width='100%' height='100%' style='border:none' src='" +
          url +
          "'></iframe>"
        );
      }
    });
  }
}
