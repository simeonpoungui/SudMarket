import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/Services/global.service';
import { ImageProduit, Produit, Variations} from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit } from 'src/app/Models/produit.model';
import { ProduitsVariante } from 'src/app/Models/produit.model';
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AlertInfoComponent } from 'src/app/core/alert-info/alert-info.component';
import { LOG } from '@zxing/library/esm/core/datamatrix/encoder/constants';
import { CategorieFormComponent } from 'src/app/settings/categorie/categorie-form/categorie-form.component';

@Component({
  selector: 'app-produit-fiche',
  templateUrl: './produit-fiche.component.html',
  styleUrls: ['./produit-fiche.component.scss']
})
export class ProduitFicheComponent {

  action!: string;
  produit_id!: number;
  nom!: string;
  description!: string;
  categorie_id!: number;
  prix!: number;
  prix_de_revient!: number;
  quantite_en_stock!: number;
  niveau_de_reapprovisionnement!: number;
  description_courte?: string;
  description_longue?: string;
  type_produit?: string;
  prix_reduit?: number;
  unite_mesure?: string;
  code_barres?: string;
  hauteur?: number;
  etat_du_stock?: 'En stock' | 'Rupture de stock' | 'En réapprovisionnement';
  poids?: number; // en kg
  longueur?: number; // en cm
  largeur?: number; // en cm
  cree_le!: Date;
  mis_a_jour_le!: Date;
  sku!: string | undefined;

  message!: any;
  produit!: Produit;
  TbCategorie: any
  tbPointdeVente!: PointsDeVentes[];
  point_de_vente_id!: number | undefined;
  isloadingsubmitForm!: boolean

  TbVariations: ProduitsVariante[] = [];
  productCombinations: any[] = [];
  tbCombinaisons: any[] = []
  variation: any = {}; //

  additionalValue: string = '';
  additionalPrix!: null ;
  additionalStock!: null;

  newValeur: string = '';
  newPrix: number | null = null;
  newQuantite: number | null = null;
  selectAll = false; // Variable qui lie le checkbox global

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
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
      this.categorie_id
    );
  }
  selectedVariationIndex: number | null = null; 

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action'];
    console.log(this.action);
    const produitJSON = localStorage.getItem('selectedProduit');
    if (produitJSON) {
      this.produit = JSON.parse(produitJSON);
      console.log(this.produit);
    }
      this.initFormProduit();
      this.getVariationByIdProduit()
      this.getCombinaisonByProduit()
      this.getImageByproduiID()
      this.loadPointDeVente();
      this.getCategorieProduit()
  }

  getCategorieProduit(){
    this.produitService.getListCategorieProduit().subscribe(res =>{
      console.log(res.message);
      this.TbCategorie = res.message
    })
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

  initFormProduit() {
    // Initialisation des champs principaux du produit
    this.produit_id = this.produit.produit_id;
    this.point_de_vente_id = this.produit.point_de_vente_id;
    this.nom = this.produit.nom;
    this.sku = this.produit.sku;
    this.description_courte = this.produit.description_courte;
    this.description_longue = this.produit.description_longue; // Si vous avez cette propriété
    this.categorie_id = this.produit.categorie_id;
    this.prix = this.produit.prix;
    this.prix_de_revient = this.produit.prix_de_revient; // Prix de revient si nécessaire
    this.prix_reduit = this.produit.prix_reduit; // Prix réduit si nécessaire
    this.unite_mesure = this.produit.unite_mesure;
    this.code_barres = this.produit.code_barres;
    this.quantite_en_stock = this.produit.quantite_en_stock;
    this.niveau_de_reapprovisionnement = this.produit.niveau_de_reapprovisionnement;
    this.etat_du_stock = this.produit.etat_du_stock; // "En stock", "Rupture de stock", etc.
    this.poids = this.produit.poids; // Poids en kg
    this.longueur = this.produit.longueur; // Longueur en cm
    this.largeur = this.produit.largeur; // Largeur en cm
    this.hauteur = this.produit.hauteur; // Hauteur en cm
    this.type_produit = this.produit.type_produit; // Type de produit (par exemple, "variable" ou "simple")
  }

  getCombinaisonByProduit() {
    const produit: GetProduit = {
      produit_id: this.produit.produit_id
    };
  console.log(produit);
    this.produitService.getCombinaisonByProduitId(produit).subscribe(res => {
      console.log(res.message);
      this.tbCombinaisons = res.message
      this.productCombinations = res.message.map((combination: any) => ({
        ...combination, // Copier les propriétés existantes
        selected: true // Ajouter la propriété `selected` à true pour cocher la case
      }));
    });
  }
  

  getVariationByIdProduit() {
    const produit: GetProduit = {
      produit_id: this.produit.produit_id
    };
  
    this.produitService.getVariationByProduitId(produit).subscribe(res => {
      console.log(res); // Vérifie la structure complète de la réponse
      
      // Vérifie si res.message est un tableau
      if (Array.isArray(res.message)) {
        this.TbVariations = [];
        res.message.forEach((variation: { nom: string; valeur: any; prix: any; quantite_en_stock: any; couleur: any; sku: any; }) => {
          const existingVariation = this.TbVariations.find(v => v.nom === variation.nom);
          if (existingVariation) {
            existingVariation.valeurs.push({
              valeur: variation.valeur
            });
          } else {
            // Si elle n'existe pas, on crée une nouvelle entrée
            this.TbVariations.push({
              nom: variation.nom,
              valeurs: [{
                valeur: variation.valeur
              }]
            });
          }
        });
  
        // Afficher le résultat final
        console.log(this.TbVariations);
      } else {
        console.error('La structure de res.message n\'est pas un tableau', res.message);
      }
    });
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

  generateSKU(): string {
    const timestamp = Date.now(); 
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); 
    return `SKU-${timestamp}-${randomSuffix}`; 
  }
  

  onSubmitForm(form: NgForm) {
    this.isloadingsubmitForm = true;
    const produit: Produit = form.value;
    produit.TbVariations = this.TbVariations; 
  
    produit.sku = this.generateSKU();
  
    const objetSend: any = {
      nom: produit.nom,
      type_produit: produit.type_produit,
      point_de_vente_id: produit.point_de_vente_id,
      categorie_id: produit.categorie_id,
      prix: produit.prix,
      prix_de_revient: produit.prix_de_revient,
      prix_reduit: produit.prix_reduit,
      quantite_en_stock: produit.quantite_en_stock,
      unite_mesure: produit.unite_mesure,
      code_barres: produit.code_barres,
      poids: produit.poids,
      etat_du_stock: produit.etat_du_stock,
      description_courte: produit.description_courte,
      description_longue: produit.description_longue,
      niveau_de_reapprovisionnement: produit.niveau_de_reapprovisionnement,
      sku: produit.sku, 
      longueur: produit.longueur,
      largeur: produit.largeur,
      hauteur: produit.hauteur,
      TbVariations: produit.TbVariations,
      productCombinations: this.tbCombinaisons
    };
  
    console.log(objetSend); 
      if (this.action === 'edit') {
        objetSend.produit_id = this.produit.produit_id;
        this.produitService.update(objetSend).subscribe((data) => {
          console.log(data);
          this.message = data.message;
          this.router.navigateByUrl('produit/list');
          this.isloadingsubmitForm = false
          this.globaService.toastShow(this.message, 'Succès', 'success');
          this.sendImageByProduit();
        });
      } else {
        this.produitService.create(objetSend).subscribe(
          (data) => {
            console.log(data); 
            if (data.code === 'succes') {
              this.router.navigateByUrl('produit/list');
              this.globaService.toastShow("Le produit a été ajouté avec succès", 'Succès', 'success');
              this.isloadingsubmitForm = false;
            } else {
              this.isloadingsubmitForm = false;
              this.globaService.toastShow('Erreur: ' + data.message, 'Erreur', 'error');
            }
          },
          (error) => {
            console.error('Erreur lors de la requête API:', error); // En cas d'erreur HTTP
            this.isloadingsubmitForm = false;
            this.globaService.toastShow('Une erreur est survenue', 'Erreur', 'error');
          }
        );
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

toggleSelectAll() {
  let allValid = true; // Variable pour vérifier si toutes les combinaisons sont valides
  this.productCombinations.forEach(combination => {
    if (!combination.prix || !combination.quantite_en_stock) {
      // Annuler la sélection pour les combinaisons invalides
      allValid = false;
      combination.selected = false;
    } else {
      // Appliquer la sélection globale uniquement si `selectAll` est vrai
      combination.selected = this.selectAll;
    }
  });

  if (!allValid) {
    // Si une combinaison invalide est trouvée, décocher `selectAll`
    this.selectAll = false;
    this.globaService.toastShow(
      "Veuillez renseigner le prix et la quantité pour toutes les combinaisons avant de les sélectionner.",
      "Erreur",
      "error"
    );
  }
}



onCheckboxChange(combination: any) {
  // Vérifier si le prix ou la quantité sont absents
  if (!combination.prix || !combination.quantite_en_stock) {
    // Annuler la sélection immédiatement
    setTimeout(() => {
      combination.selected = false; // Réinitialise la sélection
    }, 0);

    // Afficher une alerte pour informer l'utilisateur
    this.globaService.toastShow(
      "Veuillez renseigner le prix et la quantité avant de sélectionner cette combinaison.",
      "Erreur",
      "error"
    );
  }
}



saveChangesVariations() {
  const selectedCombinations = this.productCombinations.filter(combination => combination.selected);
  if (selectedCombinations.length === 0) {
    this.globaService.toastShow("Veuillez sélectionner au moins une combinaison avant d’enregistrer.", "Information", 'info');
    return; 
  }
  
  // Traiter les combinaisons sélectionnées
  const updatedCombinations = selectedCombinations.map(combination => {
    console.log(combination);
    
    const { selected, ...combinationWithoutSelected } = combination;
    combinationWithoutSelected.sku = `SKU-${combination.combination_hash}-${combination.quantite_en_stock}`;
    return combinationWithoutSelected;
  });

  this.tbCombinaisons = updatedCombinations;
  console.log(this.tbCombinaisons);

  // Fermer le modal après succès
  const modal = document.getElementById('exampleModal');
  if (modal) {
    (modal as any).classList.remove('show');
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }
}


generateCombinations() {
  const variations = this.TbVariations;

  // Génère toutes les combinaisons possibles à partir des variations
  const combinations = this.getCombinations(variations.map(v => v.valeurs));

  // Initialise les combinaisons avec les propriétés par défaut
  this.productCombinations = combinations.map(comb => ({
    combination_hash: comb.map((c: { valeur: any }) => c.valeur).join('-'), // Génère le hash de la combinaison
    quantite_en_stock: 0,  // Quantité par défaut
    prix: 0,               // Prix par défaut
    prix_reduit: 0,        // Prix réduit par défaut
    prix_de_revient: 0,    // Prix de revient par défaut
    code_barres: '',       // Code-barres par défaut (vide)
    niveau_de_reapprovisionnement: 0, // Niveau de réapprovisionnement par défaut
    selected: false        // État sélectionné par défaut
  }));

  console.log(this.productCombinations);
}

getCombinations(arrays: any[]): any[] {
  if (arrays.length === 0) return [[]];
  const first = arrays[0];
  const rest = arrays.slice(1);

  // Combine récursivement les éléments du tableau
  const combinationsWithoutFirst = this.getCombinations(rest);
  const combinationsWithFirst = first.map((f: any) => combinationsWithoutFirst.map(c => [f, ...c])).flat();

  return combinationsWithFirst;
}


ajouterValeurSupplementaire() {
  const produitIndex = this.TbVariations.findIndex(v => v.nom === this.variation.nom);
  if (produitIndex > -1) {
      // Vérifier si la valeur supplémentaire existe déjà pour cette variation
      const valeurExisteDeja = this.TbVariations[produitIndex].valeurs.some(v => v.valeur === this.additionalValue);

      if (!valeurExisteDeja) {
          // Ajouter la nouvelle valeur au tableau "valeurs" de la variation existante
          const nouvelleValeur: Variations = {
              valeur: this.additionalValue
          };

          // Ajouter la nouvelle valeur au tableau des valeurs du produit
          this.TbVariations[produitIndex].valeurs.push(nouvelleValeur);
          console.log(this.TbVariations);

          // Régénérer les combinaisons après l'ajout
          this.generateCombinations();
      } else {
          this.globaService.toastShow("Cette valeur existe déjà", "Erreur");
      }
  }

  // Réinitialiser les champs après ajout
  this.additionalValue = '';
  this.additionalPrix = null;
  this.additionalStock = null;
  this.variation = { nom: '', valeur: '', prix: null, quantite_en_stock: null, couleur: '' };
}


  // Fonction appelée à chaque modification dans un champ de saisie
  onValueChange(variationIndex: number, valueIndex: number, field: string, newValue: any): void {
    console.log(`Changement détecté dans ${field} de la variation "${this.TbVariations[variationIndex].nom}"`);
    console.log(`Nouvelle valeur pour ${field}: ${newValue}`);
    console.log(this.TbVariations);
    this.generateCombinations()
  }

  
  // Méthode pour ouvrir l'édition d'une variation spécifique
  openEditVariation(index: number) {
    this.selectedVariationIndex = index; // On stocke l'index de la variation sélectionnée
  }

  // Vous pouvez ajouter une méthode pour sauvegarder les modifications, si nécessaire.
  saveChanges() {
    const selectedVariation = this.TbVariations[this.selectedVariationIndex!];
    // Effectuez les actions nécessaires pour sauvegarder cette variation.
  }

  ajouterVariation() {  
    // Créer un nouvel objet de variation avec la première valeur
    const nouvelleVariation = {
      nom: this.variation.nom,
      valeurs: [
        {
          valeur: this.variation.valeur
        }
      ],
    };
  
    // Vérifier si la variation existe déjà dans le tableau TbVariations
    const index = this.TbVariations.findIndex(v => v.nom === this.variation.nom);
  
    if (index > -1) {
      // Si la variation existe déjà, on ajoute la nouvelle valeur dans le tableau des valeurs
      this.TbVariations[index].valeurs.push(...nouvelleVariation.valeurs);
      console.log(this.TbVariations);
      
      this.globaService.toastShow("Variation modifiée avec succès", "Succès");
    } else {
      // Si la variation n'existe pas encore, on l'ajoute au tableau TbVariations
      this.TbVariations.push(nouvelleVariation);
      this.globaService.toastShow("Variation ajoutée avec succès", "Succès");
    }
      // Générer les combinaisons après chaque ajout ou modification de variation
  this.generateCombinations();
    console.log(this.TbVariations);
    // Réinitialiser l'objet variation pour le prochain ajout
    this.variation = { nom: '', valeur: '', prix: null, quantite_en_stock: null, couleur: '' };
  }

  
  addNewValue() {
    if (this.selectedVariationIndex !== null) {
      const selectedVariation = this.TbVariations[this.selectedVariationIndex];
  
      // Vérifier si la valeur saisie est non vide et unique
      if (this.newValeur && !selectedVariation.valeurs.some(v => v.valeur === this.newValeur.trim())) {
        // Ajouter la nouvelle valeur à la liste des valeurs
        selectedVariation.valeurs.push({
          valeur: this.newValeur.trim() // On enlève les espaces inutiles
        });
  
        console.log(selectedVariation);
        console.log(this.TbVariations);
  
        // Régénérer les combinaisons après ajout de la nouvelle valeur
        this.generateCombinations();
      }
  
      // Réinitialiser les champs de saisie
      this.newValeur = '';
      this.newPrix = null;
      this.newQuantite = null;
    }
  }
  

  
  ajouterOuModifier() {
    if (this.additionalValue && this.additionalPrix !== null && this.additionalStock !== null) {
      this.ajouterValeurSupplementaire();
    } else {
      this.ajouterVariation();
    }
  }

  addCategorie(){
    const dialog = this.dialog.open(CategorieFormComponent)
    dialog.componentInstance.action = "create"
    dialog.componentInstance.openByComponentCategorie = true
    dialog.id = 'CategorieFormComponent'
    dialog.afterClosed().subscribe(res =>{
      if (res) {
        this.getCategorieProduit()
      }
    })
  }

  updateproduit(){
    this.router.navigateByUrl('/produit/edit')
  }

 
  
  // deleteproduit(){
  //   const alert = this.dialog.open(AlertComponent)
  //   alert.componentInstance.content = "Voulez-vous supprimé le fournissuer " + this.produit.nom + ' ?'
  //   alert.componentInstance.backgroundColor = "danger"
  //   alert.afterClosed().subscribe(confirmDelete => {
  //     if (confirmDelete) {
  //       console.log(this.produit);
  //       this.produitService.delete(this.produit).subscribe(data => {
  //         console.log(data.message);
  //         this.message = data.message
  //         this.router.navigateByUrl('/produit/list')
  //         this.globalService.toastShow(this.message,'Succès','success')
  //       } )
  //     }
  //   })
  // }
}
