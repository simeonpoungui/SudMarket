import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';

@Component({
  selector: 'app-select-point-de-vente',
  templateUrl: './select-point-de-vente.component.html',
  styleUrls: ['./select-point-de-vente.component.scss']
})
export class SelectPointDeVenteComponent {
  dataSource!: any
  isloadingpage!: boolean
  pointSelected!: PointsDeVentes
  displayedColumns = [
    'nom',
    'adresse',
    'ville',
    'pays',
    'telephone',
    'email',
    'responsable'
  ];

  user!: Utilisateur

  constructor(
    private pointsDeVenteServive: PointsDeVentesService,
    private dialog: MatDialog
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
    this.getListPointsDeVentes()
  }
  getListPointsDeVentes(){
    this.isloadingpage = true
    const pointdevente: GetUser = {
      utilisateur_id: this.user.utilisateur_id,
    }
    this.pointsDeVenteServive.getPointDeVenteByUsder(pointdevente).subscribe(data => {
      console.log(data.message);
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource([data.message]);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  onClickLine(pointdevente: PointsDeVentes){
    console.log(pointdevente.point_de_vente_id);
    this.pointSelected = pointdevente;
    console.log(this.pointSelected);
    this.dialog.closeAll()
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
