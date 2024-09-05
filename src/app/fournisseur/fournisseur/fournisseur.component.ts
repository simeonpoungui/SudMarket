import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { FournisseurService } from 'src/app/Services/fournisseur.service';
import { Fournisseur,GetFournisseur } from 'src/app/Models/fournisseur.model';
import { Utilisateur } from 'src/app/Models/users.model';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss']
})
export class FournisseurComponent {
  dataSource!: any;
  displayedColumns = [
    'nom',
    'email',
    'telephone',
    'adresse',
    'personne_de_contact',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedFournisseurString: string = ''
  nbrefournisseur: number = 0
  user!: Utilisateur
  
  constructor(
    private fournisseurService: FournisseurService,
    private router: Router,
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
    this.getListFournisseurs()
  }

  getListFournisseurs(){
    const fournisseur : GetFournisseur = {fournisseur_id: 0}
    this.isloadingpage = true
    this.fournisseurService.getList(fournisseur).subscribe(data => {
      console.log(data.message);
      this.nbrefournisseur = data.message.length
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }


  actions(element: Fournisseur){
    this.selectedFournisseurString = JSON.stringify(element); 
    localStorage.setItem('selectedFournisseur', this.selectedFournisseurString);
    if (this.selectedFournisseurString) {
      this.router.navigateByUrl('fournisseur/view')
    }
  }
}
