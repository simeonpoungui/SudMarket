import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetProduit, Produit, ProduitsVariante } from 'src/app/Models/produit.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { ProduitService } from 'src/app/Services/produit.service';

@Component({
  selector: 'app-select-variations',
  templateUrl: './select-variations.component.html',
  styleUrls: ['./select-variations.component.scss']
})
export class SelectVariationsComponent {

  produitChoosed!: Produit
  TbVariations: ProduitsVariante[] = [];
  TbCombinaisons: any[]= []
  user!: Utilisateur
  tbselectionsProduitsVariables: any[]=[]

  constructor(
    private produitService: ProduitService,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {

    console.log(this.produitChoosed);
    this.getVariationsByProduit()
    this.getCombinaisonsByProdduit()
  }


  getVariationsByProduit(){
    const produit: GetProduit = {
      produit_id: this.produitChoosed.produit_id
    }
    this.produitService.getVariationByProduitId(produit).subscribe(res => {
      console.log(res.message);
      this.TbVariations = [];
      res.message.forEach((variation: { nom: string; valeur: any; prix: any; quantite_en_stock: any; couleur: any; sku: any; }) => {
        const existingVariation = this.TbVariations.find(v => v.nom === variation.nom);
          if (existingVariation) {
          existingVariation.valeurs.push({
            valeur: variation.valeur
          });
        } else {
          this.TbVariations.push({
            nom: variation.nom,
            valeurs: [{
              valeur: variation.valeur
            }]
          });
        }
      });
  
      console.log(this.TbVariations);
    });
  }

  getCombinaisonsByProdduit(){
    const produit: GetProduit = {
      produit_id: this.produitChoosed.produit_id
    };
    this.produitService.getCombinaisonByProduitId(produit).subscribe(res => {
      console.log(res.message);
      this.TbCombinaisons = res.message
      console.log(this.TbCombinaisons);
      
    });
  }

  toggleAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.TbCombinaisons.forEach(combinaison => (combinaison.checked = isChecked));
  }

  validerSelections(): void {
    const selections = this.TbCombinaisons
      .filter(combinaison => combinaison.checked)  // Filtrer les éléments sélectionnés
      .map(combinaison => {
        // Convertir prix_unitaire et prix_de_revient en nombres
        const prixUnitaire = parseInt(combinaison.prix || 0);  // Conversion en nombre flottant
        const prixDeRevient = parseInt(combinaison.prix_de_revient || 0);  // Si prix_de_revient est vide, on le met à 0
        const benefice = (prixUnitaire - prixDeRevient) * combinaison.quantite;
        return {
          id: combinaison.id,
          produit_id: combinaison.produit_id,  // Assurez-vous que 'id' existe dans vos données
          quantite: combinaison.quantite,
          prix_unitaire: prixUnitaire.toFixed(2),  // Formatage à 2 décimales
          prix_de_revient: prixDeRevient.toFixed(2),  // Formatage à 2 décimales
          article_de_vente_id: 0,
          point_de_vente_id: this.produitChoosed.point_de_vente_id,
          prix_total_vente: (prixUnitaire * combinaison.quantite).toFixed(2),
          vente_id: 0,
          benefice: benefice.toFixed(2),  // Formatage à 2 décimales
          remise: 0,
          combination_hash: combinaison.combination_hash
        };
      });
  
    console.log(selections);  
    if (selections) {
      this.tbselectionsProduitsVariables = selections
      this.dialog.getDialogById('SelectVariationsComponent')?.close(true)
    }
  }
  
}
