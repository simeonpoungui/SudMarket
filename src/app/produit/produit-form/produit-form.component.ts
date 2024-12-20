import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ImageProduit, Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit } from 'src/app/Models/produit.model';
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-produit-form',
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.scss'],
})
export class ProduitFormComponent {
  action!: string;
  produit_id!: number;
  nom!: string;
  description!: string;
  categorie!: string;
  prix!: number;
  quantite_en_stock!: number;
  niveau_de_reapprovisionnement!: number;
  cree_le!: Date;
  mis_a_jour_le!: Date;
  message!: any;
  produit!: Produit;
  tbPointdeVente!: PointsDeVentes[];
  point_de_vente_id!: number | undefined;
  code_produit!: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pointService: PointsDeVentesService,
    private produitService: ProduitService,
    private globaService: GlobalService
  ) {}

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  image: any | ArrayBuffer | null = 'assets/images/avatar/2.png';

  isFormValid(): any {
    return (
      this.nom &&
      this.description &&
      this.prix &&
      this.quantite_en_stock &&
      this.categorie
    );
  }

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action'];
    console.log(this.action);
    const produitJSON = localStorage.getItem('selectedProduit');
    if (produitJSON) {
      this.produit = JSON.parse(produitJSON);
      console.log(this.produit);
    }
    if (this.action === 'edit') {
      this.initFormFournisseur();
      this.getImageByproduiID()
    }
    this.loadPointDeVente();
  }


  getImageByproduiID(){
    const produit: GetProduit = {produit_id: this.produit.produit_id}
    this.produitService.getImageByProduit(produit).subscribe(data => {
      console.log(data.message);
      this.image = data.message
    })
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(
      (p) => p.point_de_vente_id === point_de_vente_id
    );
    return point ? point.nom : 'Unknown Point';
  }

  //initialise form by info user
  initFormFournisseur() {
    this.produit_id = this.produit.produit_id;
    this.point_de_vente_id = this.produit.point_de_vente_id;
    this.nom = this.produit.nom;
    this.code_produit = this.produit.code_produit;
    this.description = this.produit.description;
    this.categorie = this.produit.categorie;
    this.prix = this.produit.prix;
    this.quantite_en_stock = this.produit.quantite_en_stock;
    this.niveau_de_reapprovisionnement =
    this.produit.niveau_de_reapprovisionnement;
  }

  sendImageByProduit(){
    const model: ImageProduit = {
      produit_id: this.produit.produit_id,
      image: this.image
    }
    this.produitService.updateCreateImageByProduit(model).subscribe(data => {
      console.log(data.message);
    })
  }
  //Submit form user
  onSubmitForm(form: NgForm) {
    const produit: Produit = form.value;
    console.log(produit);
    if (this.action === 'edit') {
      produit.produit_id = this.produit.produit_id;
      this.produitService.update(produit).subscribe((data) => {
        console.log(data);
        this.message = data.message;
        this.router.navigateByUrl('produit/list');
        this.globaService.toastShow(this.message, 'Succès', 'success');
        this.sendImageByProduit()
      });
    } else {
      console.log(produit);
      this.produitService.create(produit).subscribe((data) => {
        console.log(data.message);
        this.message = data.message;
        this.router.navigateByUrl('produit/list');
        this.globaService.toastShow("Votre produit a été crée avec succès", 'Succès', 'success');
        const model: ImageProduit = {
          produit_id: Number(data.message),
          image: this.image
        }
        console.log(model);
        this.produitService.updateCreateImageByProduit(model).subscribe(data => {
          console.log(data.message);
        })
      });
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
}

onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Vérifier la taille du fichier (1 Mo = 1024 * 1024 octets)
        if (file.size > 1024 * 1024) {
            alert('L\'image dépasse la taille autorisée de 1 Mo');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            this.image = e.target?.result;
            console.log(this.image);
            this.convertToBase64(file);
            this.resizeImage(file);
        };
        reader.readAsDataURL(file);
    }
}

// Fonction pour convertir l'image en Base64
convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('Base64 String - ', base64String);
    };
    reader.readAsDataURL(file);
}

// Fonction pour redimensionner l'image en 600x600 px
resizeImage(file: File): void {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
        img.src = e.target?.result as string;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Redimensionner l'image en 600x600 px
            canvas.width = 600;
            canvas.height = 600;

            // Dessiner l'image redimensionnée sur le canvas
            ctx?.drawImage(img, 0, 0, 600, 600);

            // Convertir l'image redimensionnée en base64
            const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8); // Compression JPEG à 80%
            console.log('Image redimensionnée en base64 : ', resizedBase64);
            this.image = resizedBase64;  // Utiliser cette base64 pour afficher l'image
        };
    };
    reader.readAsDataURL(file);
}



}
