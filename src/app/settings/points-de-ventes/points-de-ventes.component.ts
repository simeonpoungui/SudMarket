import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';

@Component({
  selector: 'app-points-de-ventes',
  templateUrl: './points-de-ventes.component.html',
  styleUrls: ['./points-de-ventes.component.scss']
})
export class PointsDeVentesComponent {
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
  constructor(
    private pointsDeVenteServive: PointsDeVentesService,
    private dialog: MatDialog
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    this.getListPointsDeVentes()
  }
  getListPointsDeVentes(){
    this.isloadingpage = true
    const pointdevente: GetPointsDeVentes = {
      point_de_vente_id: 0,
    }
    this.pointsDeVenteServive.getList(pointdevente).subscribe(data => {
      console.log(data);
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  onClickLine(pointdevente: PointsDeVentes){
    console.log(pointdevente.point_de_vente_id);
    this.pointSelected = pointdevente;
    this.dialog.closeAll()
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
