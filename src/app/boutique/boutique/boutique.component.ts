import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Boutique, GetBoutique } from 'src/app/Models/boutique.model';
import { BoutiqueService } from 'src/app/Services/boutique.service';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.component.html',
  styleUrls: ['./boutique.component.scss']
})
export class BoutiqueComponent {

  dataSource!: any;
  displayedColumns = [
    'nom',
    'adresse',
    'telephone',
    'responsable',
    'date_creation',
    'Actions'
  ];

  isloadingpage!: boolean
  nbboutique!: number
  selectedBoutiquestring!: string

  constructor(
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private boutiqueService: BoutiqueService
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListBoutique()
  }

  getListBoutique(){
    this.isloadingpage = true
    const boutique: GetBoutique = {boutique_id: 0}
    this.boutiqueService.getList(boutique).subscribe(data => {
      console.log(data.message);
      this.nbboutique = data.message.length
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isloadingpage = false
    })
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
  }

  create(){
    this.router.navigateByUrl('boutique-form/create')
  }

  actions(element: Boutique){
    console.log(element);
    this.selectedBoutiquestring = JSON.stringify(element); 
    localStorage.setItem('boutique', this.selectedBoutiquestring);
    if (this.selectedBoutiquestring) {
      this.router.navigateByUrl('boutique-fiche')
    }
  }
}
