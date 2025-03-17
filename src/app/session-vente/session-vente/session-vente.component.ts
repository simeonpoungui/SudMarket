import { ProduitService } from 'src/app/Services/produit.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {
  GetPointsDeVentes,
  PointsDeVentes,
} from 'src/app/Models/pointsDeVentes.model';
import { ArticlesDeVentes } from 'src/app/Models/articlesDeVente.model';
import { Vente } from 'src/app/Models/vente.model';
import { VenteService } from 'src/app/Services/vente.service';
import { GlobalService } from 'src/app/Services/global.service';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { SelectClientComponent } from 'src/app/client/select-client/select-client.component';
import { Client } from 'src/app/Models/clients.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { SessionService } from 'src/app/Services/session.service';
import { Session } from 'src/app/Models/session.ventes.model';
import { AlertInfoComponent } from 'src/app/core/alert-info/alert-info.component';
import { CaissesService } from 'src/app/Services/caisses.service';
import { Facture } from 'src/app/Models/Facture.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { SelectVariationsComponent } from '../select-variations/select-variations.component';
import { EntrepotService } from 'src/app/Services/entrepot.service';

@Component({
  selector: 'app-session-vente',
  templateUrl: './session-vente.component.html',
  styleUrls: ['./session-vente.component.scss'],
})
export class SessionVenteComponent {
  dataSource!: any;
  tbarticle: ArticlesDeVentes[] = [];
  selectedArticleId: number | null = null;
  quantitesProduits: { [produitId: number]: number } = {};
  quantiteMode: boolean = false; // Mode pour définir la quantité
  calculatriceValeur: string = '';
  isQtySelected: boolean = false;

  displayedColumnsArticleVente = ['produit_id', 'quantite', 'prixTotal'];

  displayedColumns = [
    'nom',
    'description',
    'categorie',
    'prix',
    'quantite_en_stock',
    'Actions',
  ];

  sessionStartTime!: Date;
  sessionEndTime!: Date;
  imageproduit: { [key: number]: string } = {};
  tbprovisoire!: ArticlesDeVentes[];
  tbProduit!: Produit[];
  isloadingpage!: boolean;
  pointSelected!: PointsDeVentes;
  MontantTotalApyer!: number;
  checkedProducts: any;
  point_de_vente_id!: number;
  isloadingpaiement!: boolean;
  isloadingbtnvalidate!: boolean;
  montantTotalDeLaVente: number = 0;
  note!: string;
  message!: any;
  clientSelected!: Client;
  user!: Utilisateur;
  modepaiement?: string;
  currentSessionId!: number;
  IDcaissevendeur!: number;
  sessionActive: boolean = true;
  nouvelleQuantite!: number;

  Facture!: Facture;
  TbCategorie: any;
  categorizedProducts: { [key: number]: any[] } = {}; 
  selectedCategory: any;

  tbselectionsProduitsVariables : any[] = []
  produitIdsInStock: number[] = []; // Variable pour stocker les produit_id


  constructor(
    private produitService: ProduitService,
    private entrepotService: EntrepotService,
    private router: Router,
    private route: ActivatedRoute,
    public globlService: GlobalService,
    private venteService: VenteService,
    private caisseService: CaissesService,
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const point_de_vente_id = +this.route.snapshot.params['id'];
    this.point_de_vente_id = point_de_vente_id;
    // get user localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
    this.selectQty();
    this.getListProduit();
    this.getCaisseUser();
    this.startSession();
    this.getlisCategorieProduits();
    this.getListProductSotckBypoint()

  }


  getListProductSotckBypoint() {
    console.log(this.user.point_de_vente_id);
    this.entrepotService.getListStockPointDeVente(this.user.point_de_vente_id).subscribe(res => {
      console.log(res.message);
      if (res && res.message) {
        // Supposons que res.message contient une liste de produits, on extrait les produit_id
        this.produitIdsInStock = res.message.map((stock) => stock.produit_id);
        console.log(this.produitIdsInStock);  // Affiche les produit_ids disponibles dans le stock
  
        // Après avoir récupéré les produit_ids du stock, on récupère les produits
        this.getListProduit();
      }
    });
  }
  

  getListProduit() {
    const point_de_vente_id: GetProduit = {
      produit_id: 0,
    };
    
    this.produitService.getList(point_de_vente_id).subscribe((data) => {
      console.log(data.message);
      if (typeof data.message === 'string') {
        this.sessionActive = false;
        const dialog = this.dialog.open(AlertInfoComponent);
        dialog.afterClosed().subscribe((result) => {
          this.router.navigateByUrl('/');
        });
        dialog.componentInstance.content =
          'Desolé Aucun produit trouvé avec ce point de vente : ' +
          ' ' +
          this.pointSelected.nom;
        this.dataSource = new MatTableDataSource([]);
      } else {
        this.tbProduit = data.message;
  
        // Filtrer les produits disponibles en stock
        const filteredProducts = this.tbProduit.filter((produit) =>
          this.produitIdsInStock.includes(produit.produit_id)
        );
  
        // Organiser les produits par catégorie
        this.categorizeProductsByCategory(filteredProducts);
  
        // Récupérer les images pour chaque produit filtré
        filteredProducts.forEach((produit) => {
          this.getImageByproduiID(produit.produit_id);
        });
      }
    });
  }
  

  getlisCategorieProduits() {
    this.produitService.getListCategorieProduit().subscribe((res) => {
      console.log(res.message);
      this.TbCategorie = res.message;
      if (this.TbCategorie && this.TbCategorie.length > 0) {
        this.selectedCategory = this.TbCategorie[0];
      }
      this.categorizeProductsByCategory(this.tbProduit);
    });
  }

  categorizeProductsByCategory(products: any[]) {
    this.categorizedProducts = {};  // Réinitialiser les produits catégorisés
    products.forEach((product) => {
      const categoryId = product.categorie_id;
      if (!this.categorizedProducts[categoryId]) {
        this.categorizedProducts[categoryId] = [];
      }
      this.categorizedProducts[categoryId].push(product);
    });
  }
  

  getImageByproduiID(IDproduit: number) {
    const produit: GetProduit = { produit_id: IDproduit };
    this.produitService.getImageByProduit(produit).subscribe((data) => {
      console.log(data);
      if (data.message) {
        this.imageproduit[IDproduit] = `${data.message}`;
        console.log(this.imageproduit);
      } else {
        console.log(`Aucune image trouvée pour le produit ID: ${IDproduit}`);
      }
    });
  }

  onCategorySelect(category: any) {
    return this.categorizedProducts[category.categorie_id] || [];
  }

  ajouterArticle(produit: Produit): void {
    console.log(produit);
  
    // Vérifie si le produit est de type simple
    if (produit.type_produit === 'simple') {
      const articleExistant = this.tbarticle.find(
        (article) => article.produit_id === produit.produit_id
      );
  
      if (articleExistant) {
        // Augmente la quantité de l'article existant
        const nouvelleQuantite = articleExistant.quantite + 1;
        if (Number.isInteger(nouvelleQuantite) && nouvelleQuantite >= 0) {
          articleExistant.quantite = nouvelleQuantite;
          articleExistant.prix_total_vente = nouvelleQuantite * produit.prix;
  
          // Calcul du bénéfice total en tenant compte de la nouvelle quantité
          articleExistant.benefice =
            (produit.prix - produit.prix_de_revient) * nouvelleQuantite;
  
          // Met à jour la quantité du produit dans quantitesProduits
          this.quantitesProduits[produit.produit_id] = nouvelleQuantite;
          this.calculerTotalArticles();
        }
      } else {
        // Ajoute un nouvel article avec une quantité de 1
        const nouvelleQuantite = 1;
        if (Number.isInteger(nouvelleQuantite) && nouvelleQuantite >= 0) {
          this.tbarticle.push({
            produit_id: produit.produit_id,
            quantite: nouvelleQuantite,
            prix_unitaire: produit.prix,
            prix_de_revient: produit.prix_de_revient,
            prix_total_vente: produit.prix,
            article_de_vente_id: 0,
            point_de_vente_id: this.point_de_vente_id,
            vente_id: 0,
            benefice: (produit.prix - produit.prix_de_revient) * nouvelleQuantite,
            remise: 0,
          });
  
          // Met à jour la quantité dans quantitesProduits
          this.quantitesProduits[produit.produit_id] = nouvelleQuantite;
          this.calculerTotalArticles();
        }
      }
  
      // Sélectionne l'article actuel
      this.selectedArticleId = produit.produit_id;
      console.log(this.tbarticle, this.quantitesProduits);
    }
  
    // Vérifie si le produit est de type variable
    else if (produit.type_produit === 'variable') {
      const dialog = this.dialog.open(SelectVariationsComponent);
      dialog.componentInstance.produitChoosed = produit;
      dialog.id = 'SelectVariationsComponent';
      dialog.afterClosed().subscribe(result => {
        if (result) {
          // Une fois que le dialogue est fermé et que nous avons les sélections de produits variables
          this.tbselectionsProduitsVariables = dialog.componentInstance.tbselectionsProduitsVariables;
          console.log(this.tbselectionsProduitsVariables);
  
          // Ajoute chaque sélection à tbarticle
          this.tbselectionsProduitsVariables.forEach((variation) => {
            const nouvelleQuantite = variation.quantite;
            const prixUnitaire = parseInt(variation.prix_unitaire);
            const prixDeRevient = parseFloat(variation.prix_de_revient);
  
            const prixTotalVente = prixUnitaire * nouvelleQuantite;
            const benefice = (prixUnitaire - prixDeRevient) * nouvelleQuantite;
  
            this.tbarticle.push({
              id: variation.id,
              produit_id: variation.produit_id,
              quantite: nouvelleQuantite,
              prix_unitaire: prixUnitaire,
              prix_de_revient: prixDeRevient,
              prix_total_vente: prixTotalVente,
              article_de_vente_id: 0,
              point_de_vente_id: this.point_de_vente_id,
              vente_id: 0,
              benefice: benefice,
              remise: 0,
              combination_hash: variation.combination_hash
            });
  
            // Met à jour la quantité de chaque produit dans quantitesProduits
            // this.quantitesProduits[variation.produit_id] = nouvelleQuantite;
          });
  
          // Recalcule les totaux après avoir ajouté les produits variables
          this.calculerTotalArticles();
          console.log(this.tbarticle); // Affiche le tableau final mis à jour
        }
      });
    }
  }
  
  calculerTotalArticles() {
    this.montantTotalDeLaVente = this.tbarticle.reduce((total, article) => {
      const prixTotal = Number(article.prix_total_vente);
      return total + prixTotal;
    }, 0);
  }

  selectArticle(articleId: number): void {
    this.selectedArticleId = articleId;
  }

  selectQty(): void {
    this.isQtySelected = !this.isQtySelected;
    console.log('Qty sélectionné:', this.isQtySelected);
  }

  modifierQuantiteArticle(valeur: string | number): void {
    if (this.selectedArticleId !== null) {
      const article = this.tbarticle.find(
        (art) => art.produit_id === this.selectedArticleId
      );
      if (article) {
        let nouvelleQuantite = String(article.quantite);
        if (valeur === '+/-') {
          nouvelleQuantite = (Number(nouvelleQuantite) * -1).toString();
        } else if (valeur === '.') {
          if (
            Number(nouvelleQuantite) >= 2 &&
            !nouvelleQuantite.includes('.')
          ) {
            nouvelleQuantite += '.';
          }
        } else {
          if (Number(nouvelleQuantite) < 2) {
            nouvelleQuantite = String(valeur);
          } else {
            nouvelleQuantite += valeur;
          }
        }
        const quantiteNumerique = parseFloat(nouvelleQuantite);
        if (!isNaN(quantiteNumerique) && quantiteNumerique >= 0) {
          article.quantite = quantiteNumerique;
          article.prix_total_vente = article.quantite * article.prix_unitaire;
          article.benefice =
            (article.prix_unitaire - article.prix_de_revient) *
            article.quantite;
          this.quantitesProduits[article.produit_id] = quantiteNumerique;
          this.tbarticle = [...this.tbarticle];
          console.log(this.tbarticle);
          this.calculerTotalArticles();
        } else {
          console.error('Quantité invalide');
        }
      }
    } else {
      console.error('Aucun article sélectionné');
    }
  }

  

  resetArticle(): void {
    if (this.selectedArticleId !== null) {
      const article = this.tbarticle.find(
        (art) => art.produit_id === this.selectedArticleId
      );
      if (article) {
        article.quantite = 1;
        article.prix_total_vente = article.quantite * article.prix_unitaire;
        this.quantitesProduits[article.produit_id] = 1;
        this.tbarticle = [...this.tbarticle];
        this.calculerTotalArticles();
        console.log('Article réinitialisé:', article);
      }
    } else {
      console.error('Aucun article sélectionné');
    }
  }

  selectAction(action: string): void {
    if (action === 'reset') {
      this.resetArticle();
    } else {
      console.log(`Action sélectionnée: ${action}`);
    }
  }

  getProduitName(produit_id: number): string {
    const produit = this.tbProduit.find((p) => p.produit_id === produit_id);
    return produit ? produit.nom : '';
  }

  getCaisseUser() {
    const user: GetUser = { utilisateur_id: this.user.utilisateur_id };
    this.caisseService.getCaisseByUser(user).subscribe((data) => {
      console.log(data.message);
      this.IDcaissevendeur = data.message.caisse_vendeur_id;
      console.log(this.IDcaissevendeur);
    });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  valueNote(event: any): void {
    this.note = event.target.value;
    console.log(this.note);
  }

  resetSale(): void {
    this.tbarticle = [];
    this.montantTotalDeLaVente = 0;
    console.log(this.tbarticle);
    this.quantitesProduits = {};
  }

  ValidatePaiement() {
    const vente = {
      vente_id: 0,
      session_id: this.currentSessionId,
      montant_total: this.montantTotalDeLaVente,
      client_id: this.clientSelected.client_id,
      point_de_vente_id: this.point_de_vente_id,
      utilisateur_id: this.user.utilisateur_id,
      mode_de_paiement: '',
      caisse_vendeur_id: this.IDcaissevendeur,
      total_benefice_vente: this.tbarticle.reduce(
        (total, article) => total + article.benefice,
        0
      ),
      note: this.note,
      articles: this.tbarticle,
    };
    console.log(vente);

     const venteString = JSON.stringify(vente);
     localStorage.setItem('vente', venteString);
     if (venteString) {
      this.router.navigateByUrl('/payement');
     }
  }

  chooseClient() {
    const dialog = this.dialog.open(SelectClientComponent);
    dialog.id = 'SelectClientComponent';
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.clientSelected = dialog.componentInstance.clientSelected;
        console.log(this.clientSelected);
      }
    });
  }

  startSession() {
    this.sessionStartTime = new Date();
    const newSession: Session = {
      user_id: this.user.utilisateur_id,
      start_time: this.sessionStartTime,
      end_time: this.sessionStartTime,
      point_de_vente_id: this.point_de_vente_id,
      session_id: 0,
      statut: 'Ouvert',
    };
    console.log(newSession);
    this.sessionService.createSession(newSession).subscribe((response) => {
      this.message = response.message;
      this.globlService.toastShow(this.message, '');
      this.currentSessionId = response.detail.session_id;
      console.log(this.currentSessionId);
    });
  }

  endSession() {
    const dialog = this.dialog.open(AlertComponent);
    dialog.componentInstance.content =
      'Voulez-vous fermer cette session de vente ?';
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.sessionActive = false;
        console.log(this.sessionStartTime, this.currentSessionId);
        if (this.sessionStartTime && this.currentSessionId) {
          this.sessionEndTime = new Date();
          const updatedSession: Session = {
            session_id: Number(this.currentSessionId),
            user_id: this.user.utilisateur_id,
            start_time: this.sessionStartTime,
            end_time: this.sessionEndTime,
            point_de_vente_id: this.point_de_vente_id,
            statut: 'Fermé',
          };
          console.log(updatedSession);
          this.sessionService.updateSession(updatedSession).subscribe((res) => {
            console.log(res.message);
            this.globlService.toastShow(
              'Session Fermé le' +
                ' ' +
                this.globlService.formatFrenchDateSessionVnte(
                  this.sessionEndTime
                ),
              'Succès'
            );
            this.globlService.reloadComponent('vente-journaliere');
          });
        }
      }
    });
  }
}
