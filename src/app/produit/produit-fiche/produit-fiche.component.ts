import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';

@Component({
  selector: 'app-produit-fiche',
  templateUrl: './produit-fiche.component.html',
  styleUrls: ['./produit-fiche.component.scss']
})
export class ProduitFicheComponent {
  action:string = 'view';
  produit!: Produit;
  message!: any
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private dialog: MatDialog,
    private produitService: ProduitService
  ){}

  ngOnInit(): void {
    console.log(this.action);
    const produitJson = localStorage.getItem('selectedProduit');
    if (produitJson) {
      this.produit =  JSON.parse(produitJson);
    }
  }
  updateproduit(){
    this.router.navigateByUrl('/produit/edit')
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
