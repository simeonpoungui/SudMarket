import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-produit-fiche',
  templateUrl: './produit-fiche.component.html',
  styleUrls: ['./produit-fiche.component.scss']
})
export class ProduitFicheComponent {
  action:string = 'view';
  produit!: Produit;
  message!: any

  tbPointdeVente!: PointsDeVentes[];

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pointService: PointsDeVentesService,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private produitService: ProduitService
  ){}

  ngOnInit(): void {
    console.log(this.action);
    const produitJson = localStorage.getItem('selectedProduit');
    if (produitJson) {
      this.produit =  JSON.parse(produitJson);
      console.log(this.produit);
    }
    this.loadPointDeVente()
  }
  updateproduit(){
    this.router.navigateByUrl('/produit/edit')
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
      console.log(this.tbPointdeVente);
      
    });
  }

  getPointName(point_de_vente_id:  number | undefined ): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    console.log(point);
    
    return point ? point.nom : 'Unknown Point';
  }
  
  deleteproduit(){
    const alert = this.dialog.open(AlertComponent)
    alert.componentInstance.content = "Voulez-vous supprimé le fournissuer " + this.produit.nom + ' ?'
    alert.componentInstance.backgroundColor = "danger"
    alert.afterClosed().subscribe(confirmDelete => {
      if (confirmDelete) {
        console.log(this.produit);
        this.produitService.delete(this.produit).subscribe(data => {
          console.log(data.message);
          this.message = data.message
          this.router.navigateByUrl('/produit/list')
          this.globalService.toastShow(this.message,'Succès','success')
        } )
      }
    })
  }
}
