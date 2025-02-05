import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetProduit, Produit, ProduitsVariante } from 'src/app/Models/produit.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { ProduitService } from 'src/app/Services/produit.service';

@Component({
  selector: 'app-select-variations-commande',
  templateUrl: './select-variations-commande.component.html',
  styleUrls: ['./select-variations-commande.component.scss']
})
export class SelectVariationsCommandeComponent {
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
    const selections = this.TbCombinaisons.filter(combinaison => combinaison.checked).map(combinaison => {
        // Convertir prix_unitaire en nombre
        const prixUnitaire = Number(combinaison.prix || 0);  // Conversion en nombre flottant
        const prixDeRevient = Number(combinaison.prix_de_revient || 0);  // Si prix_de_revient est vide, on le met à 0
        const benefice = (prixUnitaire - prixDeRevient) * combinaison.quantite;
  
        return {
          id: combinaison.id,
          article_commande_achat_id: 0,  // Id temporaire
          point_de_vente_id: this.produitChoosed.point_de_vente_id,  // Point de vente de l'utilisateur
          commande_achat_id: 0,  // Id temporaire
          produit_id: combinaison.produit_id,  // Id du produit
          quantite: combinaison.quantite,  // Quantité sélectionnée
          prix_unitaire: prixUnitaire.toFixed(2),  // Formatage à 2 décimales
          prix_total_commande: (prixUnitaire * combinaison.quantite).toFixed(2),  // Calcul du total de la commande
        };
      });
  
    console.log(selections);  
    if (selections) {
      this.tbselectionsProduitsVariables = selections;
      this.dialog.getDialogById('SelectVariationsComponent')?.close(true);
    }
  }
  
}
