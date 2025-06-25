import { Component,OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { DepensesService } from 'src/app/Services/depenses.service';
import { Depense, GetDepense } from 'src/app/Models/depenses.model';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-depense',
  templateUrl: './depense.component.html',
  styleUrls: ['./depense.component.scss']
})
export class DepenseComponent {

  dataSource!: any;
  displayedColumns = [
    'date_heure',
    'id_categorie',
    'montant',
    'employe_responsable',
    'point_de_vente_id',
    'Actions'
  ];  

    // Variables pour stocker les filtres sélectionnés
    selectedCategorie: number | null = null;
    selectedSousCategorie: number | null = null;
    selectedPointDeVente: number | null = null;
    selectedDateDebut: string | null = null;
    selectedDateFin: string | null = null;

  isloadingpage!: boolean
  selectedFournisseurString: string = ''
  nbrefournisseur: number = 0
  user!: Utilisateur
  tbPointdeVente: PointsDeVentes[]=[];
  tbUsers: Utilisateur[] = [];
  Tbcategorie: any[] = []
  tbSousCategories: any[] = []
  totalExpenses!: number;
  fixedCosts!: number;
  variableCosts!: number;
  cogs!: number;

  constructor(
    private depenseService: DepensesService,
    private router: Router,
    private pointService: PointsDeVentesService,
    private categorieDepenseService: DepensesService,
    public globalService: GlobalService,
    private userService: UsersService,
    private dialog: MatDialog
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
      console.log(this.user);
    }
    this.loadUsers();
    this.loadCategorie()
    this.loadPointDeVente();
    this.getDepenses()

  }

  loadCategorie(){
    this.categorieDepenseService.getListCategoriesDepenses(0).subscribe(res =>{
      console.log(res.message);
      this.Tbcategorie = res.message
      console.log(this.Tbcategorie);
      
    })
  }
    loadUsers() {
      const user: GetUser = { utilisateur_id: 0 };
      this.userService.getListUser(user).subscribe((data) => {
        console.log(data);
        this.tbUsers = data.message;
      });
    }
   
    getUserName(utilisateur_id: number): string {
      const user = this.tbUsers.find((u) => u.utilisateur_id === utilisateur_id);
      return user
        ? user.nom_utilisateur + ' ' + user.prenom_utilisateur
        : 'Unknown User';
    }

    getCategorieName(id_categorie: number): string {
      const c = this.Tbcategorie.find((u) => u.id_categorie === id_categorie);
      return c
        ? c.nom_categorie 
        : 'Unknown Categorie';
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



    getDepenses() {
      const depense: GetDepense = { id_depense: 0 };
      this.isloadingpage = true;
    
      this.depenseService.getListDepenses(depense).subscribe(data => {
        console.log('Données reçues:', data.message);
    
        // Initialisation des totaux
        let totalExpenses = 0;
        let fixedCosts = 0;
        let variableCosts = 0;
        let cogs = 0;
            
        // Associer les catégories par id_categorie
        const categoriesMap = new Map<number, string>(); // Ajout du type explicite
    
        // Vérifiez le contenu de Tbcategorie avant de remplir categoriesMap
        console.log('Tbcategorie:', this.Tbcategorie);
    
        this.Tbcategorie.forEach(categorie => {
          categoriesMap.set(categorie.id_categorie, categorie.nom_categorie);
        });
    
        // Vérifiez que categoriesMap est bien rempli
        console.log('categoriesMap:', categoriesMap);
    
        // Parcourir les dépenses pour calculer les totaux
        data.message.forEach(depense => {
          console.log('id_categorie dans depense:', depense.id_categorie); // Log de l'id_categorie
    
          const montant = Number(depense.montant); // Convertir le montant en nombre
          totalExpenses += montant; // Ajouter au total des dépenses
    
          // Vérifier le nom de la catégorie en fonction de l'id_categorie
          const categoryName = categoriesMap.get(depense.id_categorie);
    
          // Vérification si la catégorie a été trouvée
          if (categoryName) {
            console.log('Category found:', categoryName); // Debug
            if (categoryName === 'Charges fixes') { // Exemple : Charges fixes
              fixedCosts += montant;
            } else if (categoryName === 'Charges variables') { // Exemple : Charges variables
              variableCosts += montant;
            } else if (categoryName ==="Coût d'acquisition") { // Exemple : COGS
              cogs += montant;
            }
          } else {
            console.log('Category not found for id_categorie:', depense.id_categorie);
          }
        });
    
        // Assigner les valeurs calculées à la vue
        this.isloadingpage = false;
        this.dataSource = new MatTableDataSource(data.message);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    
        // Affecter les totaux pour affichage
        this.totalExpenses = totalExpenses;
        this.fixedCosts = fixedCosts;
        this.variableCosts = variableCosts;
        this.cogs = cogs;
    
        console.log(this.totalExpenses, this.fixedCosts, this.variableCosts, this.cogs);
      });
    }
    

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }


  actions(element: Depense){
      this.router.navigateByUrl('depense/edit/'  + element.id_depense)
  }

   // Fonction pour capturer le changement de catégorie
   onCategorieChange(event: any) {
    this.selectedCategorie = event.target.value ? +event.target.value : null;
    this.filterDepenses();
  }

  // Fonction pour capturer le changement de sous-catégorie
  onSousCategorieChange(event: any) {
    this.selectedSousCategorie = event.target.value ? +event.target.value : null;
    this.filterDepenses();
  }

  // Fonction pour capturer le changement de point de vente
  onPointDeVenteChange(event: any) {
    this.selectedPointDeVente = event.target.value ? +event.target.value : null;
    this.filterDepenses();
  }

  // Fonction pour capturer la date de début
  onDateDebutChange(event: any) {
    this.selectedDateDebut = event.target.value ? event.target.value : null;
    console.log(this.selectedDateDebut);
    
    this.filterDepenses();
  }

  // Fonction pour capturer la date de fin
  onDateFinChange(event: any) {
    this.selectedDateFin = event.target.value ? event.target.value : null;
    this.filterDepenses();
  }

  // Fonction pour appeler l'API avec les filtres
  filterDepenses() {
    this.isloadingpage = true
    const params = {
      id_categorie: this.selectedCategorie,
      id_sous_categorie: this.selectedSousCategorie,
      point_de_vente_id: this.selectedPointDeVente,
      dateDebut: this.selectedDateDebut,
      dateFin: this.selectedDateFin
    };
console.log(params);

    this.depenseService.getFilteredDepenses(params).subscribe(res => {
      console.log(res);
      if (typeof res.message === 'string') {
        this.dataSource = [];
        this.globalService.toastShow("Aucune dépense trouvée avec les critères spécifiés","Informations",'info')
        this.isloadingpage = false
      }else{
        this.isloadingpage = false
        this.dataSource = new MatTableDataSource(res.message);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }

    });
  }

}
