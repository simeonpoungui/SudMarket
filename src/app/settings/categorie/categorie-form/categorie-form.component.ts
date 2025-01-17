import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Categorie } from 'src/app/Models/categorie.model';
import { GlobalService } from 'src/app/Services/global.service';
import { ProduitService } from 'src/app/Services/produit.service';


@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.scss'],
})
export class CategorieFormComponent {
  action!: string; // 'create' ou 'edit'
  categorie!: Categorie;
  categorie_id!: number;
  nom!: string;
  description!: string;
  openByComponentCategorie!: boolean;

  constructor(
    private produitService: ProduitService,
    private dialog: MatDialog,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    console.log(this.categorie);
    console.log(this.action);
    console.log(this.openByComponentCategorie);

    if (this.action === 'edit') {
      this.initFormCategorieUpdate();
    }
  }

  initFormCategorieUpdate() {
    this.nom = this.categorie.nom;
    this.description = this.categorie.description;
  }

  onSubmitCategorieForm(form: NgForm) {
    const categorie: Categorie = form.value;
    console.log(categorie);
    
    if (this.action === 'edit') {
      this.produitService.updateCategorieProduit(categorie).subscribe((data) => {
        console.log(data);
        this.dialog.getDialogById('CategorieFormComponent')?.close(true);
        this.globalService.toastShow('Mise à jour effectuée', 'Succès', 'success');
      });
    } else {
      this.produitService.createCategoorieProduit(categorie).subscribe((data) => {
        console.log(data);
        if (this.openByComponentCategorie === true) {
          this.dialog.getDialogById('CategorieFormComponent')?.close(true);
        }
        this.dialog.getDialogById('CategorieFormComponent')?.close(true);
        this.globalService.toastShow('Catégorie ajoutée avec succès', 'Succès', 'success');
      });
    }
  }
}
