import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Utilisateur } from 'src/app/Models/users.model';
import { DepensesService } from 'src/app/Services/depenses.service';
import { Depense, GetDepense } from 'src/app/Models/depenses.model';

@Component({
  selector: 'app-depense',
  templateUrl: './depense.component.html',
  styleUrls: ['./depense.component.scss']
})
export class DepenseComponent {

  dataSource!: any;
  displayedColumns = [
    // 'id_depense',
    'date_heure',
    'categorie_depense',
    'montant',
    'employe_responsable',
    // 'note_additionnelle',
    'fournisseur',
    'point_de_vente_id',
    'Actions'
  ];  

  isloadingpage!: boolean
  selectedFournisseurString: string = ''
  nbrefournisseur: number = 0
  user!: Utilisateur
  
  constructor(
    private depenseService: DepensesService,
    private router: Router,
    public globalService: GlobalService,
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
    this.getDepenses()
  }

  getDepenses(){
    const depense : GetDepense = {id_depense: 0}
    this.isloadingpage = true
    this.depenseService.getListDepenses(depense).subscribe(data => {
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


  actions(element: Depense){
      this.router.navigateByUrl('depense/edit/'  + element.id_depense)
  }

}
