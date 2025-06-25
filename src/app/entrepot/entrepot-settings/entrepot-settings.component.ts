import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCommandeAchat } from 'src/app/Models/commande.model';
import { Entrepot, GetEntrepot } from 'src/app/Models/entrepot.model';
import { GetNotification, NotificationSotckproduit } from 'src/app/Models/notifications.stock.produit.model';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { CommandeService } from 'src/app/Services/commande.service';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { GlobalService } from 'src/app/Services/global.service';
import { NotificationsService } from 'src/app/Services/notifications.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { ProduitService } from 'src/app/Services/produit.service';

@Component({
  selector: 'app-entrepot-settings',
  templateUrl: './entrepot-settings.component.html',
  styleUrls: ['./entrepot-settings.component.scss'],
})
export class EntrepotSettingsComponent {
  dataSource!: any;
  displayedColumns = [
    // 'ref_produit',       // SKU (Référence produit)
    'produit', // Nom du produit
    'libelle', // Libellé (ici "Transfert stock")
    'origine', // Entrepôt d'origine
    'destination', // Point de vente de destination
    'stock_initial', // Stock initial
    'entree', // Quantité entrée
    'sortie', // Quantité sortie
    'stock_final', // Stock final
    'date_mouvement', // Date du mouvement
    // 'observations',      // Observations
    'combination_hash', // Hash de la combinaison
    'type_produit', // Type du produit
  ];

  isloadingpage!: boolean;
  selectedFournisseurString: string = '';
  nbrefournisseur: number = 0;
  entrepot_id!: number;
  tbProduit: Produit[] = [];
  tbEntrepot: Entrepot[] = [];
  entrepot!: Entrepot;
  tbPointdeVente: PointsDeVentes[]=[]
  notifications: NotificationSotckproduit[] = [];
  produitsRuptureStock: any[] = [];


  stockEntrepotList: any[] = [];
  totalEnStock: number = 0;
  totalRupture: number = 0;
  totalSeuilCritique: number = 0;
  commandesEnCoursCount = 0;
  demandeEnCoursCountReappro = 0;

  constructor(
    private entrepotService: EntrepotService,
    private router: Router,
    private notificationService: NotificationsService,
    private commandeService: CommandeService,
    private route: ActivatedRoute,
    private produitService: ProduitService,
    public globalService: GlobalService,
    private pointService: PointsDeVentesService,
    private dialog: MatDialog
  ) {}

  TbEntrepot: Entrepot[] = [];
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const entrepot_id = +this.route.snapshot.params['id'];
    this.entrepot_id = entrepot_id;
    console.log(this.entrepot_id);

    this.getListMouvement();
    this.loadProduit();
    this.getOneEntrepot();
    this.getListEntrepot();
    this.getStockEntrepot();
    this.getListCommandes();
    this.loadNotifications()
    this.loadPointDeVente();
  }

    loadPointDeVente() {
      const point: GetPointsDeVentes = { point_de_vente_id: 0 };
      this.pointService.getList(point).subscribe((data) => {
        this.tbPointdeVente = data.message;
      });
    }
  getPointName(id?: number): string {
    const point = this.tbPointdeVente.find((p) => p.point_de_vente_id === id);
    return point ? point.nom : 'Unknown';
  }

loadNotifications(): void {
  this.notificationService.getListNotificationsProduistEntrepot(this.entrepot_id).subscribe((res) => {
    this.notifications = res.message.filter((notif: any) => notif.statut === 'non traité');
    console.log(this.notifications);
    this.demandeEnCoursCountReappro = this.notifications.length;
  });
}


  getListCommandes() {
    this.commandeService.getCommandeByEnrtrepotID(this.entrepot_id).subscribe((data) => {
      console.log(data.message);
      const commandes = data.message || [];
      this.commandesEnCoursCount = commandes.filter(
        (cmd: { statut: string }) =>
          cmd.statut &&
          cmd.statut.toLowerCase().includes('en cours de livraison')
      ).length;
    });
  }

  getListEntrepot() {
    const entrepot: GetEntrepot = {
      entrepot_id: 0,
    };
    this.entrepotService.getListEntrepot(entrepot).subscribe((res) => {
      this.tbEntrepot = res.message;
      console.log(this.tbEntrepot);
    });
  }
getStockEntrepot() {
  this.entrepotService.getListStockEntrepot(this.entrepot_id).subscribe((res) => {
    this.stockEntrepotList = res.message;

    // Réinitialiser les compteurs
    this.totalEnStock = 0;
    this.totalRupture = 0;
    this.totalSeuilCritique = 0;

    // Réinitialiser la liste des ruptures
    this.produitsRuptureStock = [];

    this.stockEntrepotList.forEach((stock) => {
      if (stock.quantite <= stock.niveau_de_reapprovisionnement) {
        this.totalRupture += 1;
        this.produitsRuptureStock.push(stock);
        console.log(this.produitsRuptureStock);
        
      } else {
        this.totalEnStock += 1;
      }
    });
  });
}

  getOneEntrepot() {
    const entrepot: GetEntrepot = {
      entrepot_id: this.entrepot_id,
    };
    this.entrepotService.getOneEntrepot(entrepot).subscribe((res) => {
      console.log(res.message);
      this.entrepot = res.message;
    });
  }

  loadProduit() {
    const produit: GetProduit = { produit_id: 0 };
    this.produitService.getList(produit).subscribe((data) => {
      console.log(data.message);
      this.tbProduit = data.message;
      console.log(this.tbProduit);
    });
  }

  getEntrepotName(entrepot_id: number): string {
    const entrepot = this.tbEntrepot.find(
      (element) => element.entrepot_id === entrepot_id
    );
    return entrepot ? entrepot.nom : '';
  }

  getProduitName(produit_id: number): string {
    const produit = this.tbProduit.find((p) => p.produit_id === produit_id);
    return produit ? produit.nom : '';
  }

  getListMouvement() {
    this.isloadingpage = true;
    this.entrepotService
      .getListMouvementEntrepotID(this.entrepot_id)
      .subscribe((data) => {
        console.log(data);
        if (data.code == 'erreur') {
          this.globalService.toastShow(data.message, 'Information', 'info');
          this.dataSource = new MatTableDataSource([]);
          this.isloadingpage = false;
        } else {
          this.nbrefournisseur = data.message.length;
          this.isloadingpage = false;
          this.dataSource = new MatTableDataSource(data.message);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.TbEntrepot = data.message;
        }
      });
  }
  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  create() {
    this.router.navigateByUrl('entrepot/create/' + 0);
  }

  actions(element: Entrepot) {
    this.router.navigateByUrl('entrepot-fiche/view/' + element.entrepot_id);
  }
}
