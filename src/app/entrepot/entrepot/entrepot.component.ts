import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Component, ViewChild } from '@angular/core';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { Entrepot, GetEntrepot } from 'src/app/Models/entrepot.model';


@Component({
  selector: 'app-entrepot',
  templateUrl: './entrepot.component.html',
  styleUrls: ['./entrepot.component.scss']
})
export class EntrepotComponent {
 dataSource!: any;
  displayedColumns = [
    'nom',
    'ville',
    'adresse',
    'telephone',
    'email',
    'responsable',
    'capacite_stockage',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedFournisseurString: string = ''
  nbrefournisseur: number = 0

  
  constructor(
    private entrepotService: EntrepotService,
    private router: Router,
    private globalService: GlobalService,
    private dialog: MatDialog
  ){}

  TbEntrepot: Entrepot[]  = []

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListEntrepot()
  }

  getListEntrepot(){
    const entrepot : GetEntrepot = {entrepot_id: 0}
    this.isloadingpage = true
    this.entrepotService.getListEntrepot(entrepot).subscribe(data => {
      console.log(data.message);
      this.nbrefournisseur = data.message.length
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.TbEntrepot = data.message
     });
  }

  openEntrepot(element: any){
    this.router.navigateByUrl('/parametres-entrepot/' + element.entrepot_id)
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  create(){
    this.router.navigateByUrl('entrepot/create/' + 0 )
  }


  actions(element: Entrepot){
     this.router.navigateByUrl('entrepot-fiche/view/' + element.entrepot_id)
  }
}
