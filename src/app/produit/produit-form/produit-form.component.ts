import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit } from 'src/app/Models/produit.model';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-produit-form',
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.scss']
})
export class ProduitFormComponent {
  action!:string;
  produit_id!: number;
  nom!: string;
  description!: string;
  categorie!: string;
  prix!: number;
  quantite_en_stock!: number;
  niveau_de_reapprovisionnement!: number;
  cree_le!: Date;
  mis_a_jour_le!: Date;
  message!: any
  produit!: Produit
  tbPointdeVente!: PointsDeVentes[]
point_de_vente_id: any;

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private pointService: PointsDeVentesService,
  private produitService: ProduitService,
  private globaService: GlobalService,
){}

isFormValid(): any {
  return this.nom && this.description && this.prix && this.quantite_en_stock && this.categorie;
}

ngOnInit(): void {
  this.action = this.route.snapshot.params['action']
  console.log(this.action);
  const produitJSON = localStorage.getItem('selectedProduit');
  if (produitJSON) {
    this.produit =  JSON.parse(produitJSON);
  }
  if (this.action === 'edit') {
    this.initFormFournisseur()
  }
  this.loadPointDeVente()
}

loadPointDeVente(){
  const point: GetPointsDeVentes = {point_de_vente_id:0}
  this.pointService.getList(point).subscribe(data => {
    console.log(data.message);
    this.tbPointdeVente = data.message
    
  } )
}

getPointName(point_de_vente_id: any): string {
  const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
  return point ? point.nom : 'Unknown Point';
}

//initialise form by info user
initFormFournisseur(){
  this.produit_id = this.produit.produit_id
  this.nom = this.produit.nom
  this.description = this.produit.description
  this.categorie = this.produit.categorie
  this.prix = this.produit.prix
  this.quantite_en_stock = this.produit.quantite_en_stock
  this.niveau_de_reapprovisionnement = this.produit.niveau_de_reapprovisionnement
}

//Submit form user
onSubmitForm(form: NgForm){
  const produit: Produit = form.value;
  if (this.action === 'edit') {
    produit.produit_id = this.produit.produit_id
    this.produitService.update(produit).subscribe(data => {
      console.log(data);
      this.message = data.message
      this.router.navigateByUrl('produit/list')
      this.globaService.toastShow(this.message,'Succès','success')
    })
  }else{
    console.log(produit);
    this.produitService.create(produit).subscribe(data => {
      console.log(data);
      this.message = data.message
      this.router.navigateByUrl('produit/list')
      this.globaService.toastShow(this.message,'Succès','success')
    })
  }
}
}
