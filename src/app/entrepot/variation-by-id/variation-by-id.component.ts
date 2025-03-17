import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetProduit, Produit, ProduitsVariante } from 'src/app/Models/produit.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { ProduitService } from 'src/app/Services/produit.service';

@Component({
  selector: 'app-variation-by-id',
  templateUrl: './variation-by-id.component.html',
  styleUrls: ['./variation-by-id.component.scss']
})
export class VariationByIdComponent {
  produitChoosed!: any
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
    this.produitService.getCombinaisonById(this.produitChoosed.variation_id).subscribe(res => {
      console.log(res.message);
      this.TbCombinaisons = [res.message]
      console.log(this.TbCombinaisons);
      
    });
  }
  

  toggleAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.TbCombinaisons.forEach(combinaison => (combinaison.checked = isChecked));
  }

  validerSelections(): void {
    const selections = this.TbCombinaisons.filter(combinaison => combinaison.checked).map(combinaison => {
        return {
          id: combinaison.id,
          combinaison:combinaison.combination_hash,
          sku: combinaison.sku,
          produit_id: combinaison.produit_id, 
          quantite: combinaison.quantite,  
        };
      });
  
    console.log(selections);  
    if (selections) {
      this.tbselectionsProduitsVariables = selections;
      this.dialog.getDialogById('VariationByIdComponent')?.close(true);
    }
  }
}
