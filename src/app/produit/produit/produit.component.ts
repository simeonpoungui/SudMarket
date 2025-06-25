import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.scss'],
})
export class ProduitComponent {
  dataSource!: any;
  displayedColumns = [
    'nom',
    'description',
    'categorie',
    'prix',
    'niveau_de_reapprovisionnement'
  ];

  isloadingpage!: boolean;
  selectedProduitString: string = '';
  tbPointdeVente!: PointsDeVentes[];
  produits!: Produit[];
  nbreproduits: number = 0;

  constructor(
    private produitService: ProduitService,
    private pointService: PointsDeVentesService,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog
  ) {}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListProduit();
    this.loadPointDeVente();
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  getListProduit() {
    const produit: GetProduit = { produit_id: 0 };
    this.isloadingpage = true;
    this.produitService.getList(produit).subscribe((data) => {
      console.log(data.message);
      this.produits = data.message;
      this.nbreproduits = data.message.length;
      this.isloadingpage = false;
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  actions(element: Produit) {
    this.selectedProduitString = JSON.stringify(element);
    localStorage.setItem('selectedProduit', this.selectedProduitString);
    if (this.selectedProduitString) {
      this.router.navigateByUrl('produit/view');
    }
  }

  SelectPointDeVente(event: any) {
    console.log(event.target.value);
    const point: GetPointsDeVentes = {
      point_de_vente_id: Number(event.target.value),
    };
    this.produitService.getListProduityByPointVente(point).subscribe((data) => {
      if (typeof data.message === 'string') {
        this.dataSource = new MatTableDataSource([]);
        this.nbreproduits = 0;
        this.globalService.toastShow('Aucun produit trouvé','Information','info')
      } else {
        this.dataSource = new MatTableDataSource(data.message);
        this.nbreproduits = this.dataSource.data.length;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  imprimer() {
    this.produitService
      .getListProduitEtatPDF(this.produits)
      .subscribe((data) => {
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
