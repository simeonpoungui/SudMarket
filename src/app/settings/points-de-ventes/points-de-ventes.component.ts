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
  nombreDePointsDeVente: number = 0;

  displayedColumns = [
    'nom',
    'adresse',
    'ville',
    'pays',
    'telephone',
    'email',
    'responsable',
    'Actions'
  ];
  selectedPointString!: string;
  constructor(
    private pointsDeVenteServive: PointsDeVentesService,
    private dialog: MatDialog,
    private router: Router
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
      this.nombreDePointsDeVente = data.message.length
      console.log(this.nombreDePointsDeVente);
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

  actions(element: PointsDeVentes){
    this.selectedPointString = JSON.stringify(element); 
    localStorage.setItem('selectedPointVente', this.selectedPointString);
    if (this.selectedPointString) {
      this.router.navigateByUrl('point/vente/view')
    }
  }

  imprimer() {
    this.pointsDeVenteServive.getListPointsDeVentePDF().subscribe((data) => {
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
