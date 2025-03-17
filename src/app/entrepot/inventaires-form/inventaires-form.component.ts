import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LOG } from '@zxing/library/esm/core/datamatrix/encoder/constants';
import { Entrepot, GetEntrepot } from 'src/app/Models/entrepot.model';
import { GetInventaire, Inventaire } from 'src/app/Models/inventaire.model';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { GlobalService } from 'src/app/Services/global.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-inventaires-form',
  templateUrl: './inventaires-form.component.html',
  styleUrls: ['./inventaires-form.component.scss'],
})
export class InventairesFormComponent {

  action!: string

  produits: Produit[] = [];
  produitsEntrepot: Entrepot[] = [];

  entrepots: Entrepot[] = [];
  utilisateurs: Utilisateur[] = [];
  user!: Utilisateur;


  produit_id!: number;
  entrepot_id!: number;
  quantite_comptee!: number;
  quantite_initiale!: number;
  motif!: string;
  action_recommande!: string;
  utilisateur_id!: number;
  type_produit!: string;
  ecart!: number
  variation_id!: number;
  commentaire!: string;
  combination_hash!: string;

  produitSelected: any; 
  TbCombinaisons: any[]= []
  id!: number
  message: any

  constructor(
    private entrepotService: EntrepotService,
    private router: Router,
    private route : ActivatedRoute,
    private userService: UsersService,
    private produitService: ProduitService,
    private globalService: GlobalService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {

    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }

    this.id = +this.route.snapshot.params['id']
     this.action = this.route.snapshot.params['action']
    
    console.log(this.id, this.action);

    if (this.action == 'edit') {
      this.initFormInventaire()
    }

    this.loadProduit();
    this.loadEntrepot();
    this.loadUsers();
  }

  initFormInventaire(){
    const inventaire: GetInventaire = {
      id: this.id
    }
    console.log(inventaire);
    this.entrepotService.getOneInventaires(inventaire).subscribe(res =>{
      console.log(res.message);
      this.produit_id = res.message.produit_id
      this.entrepot_id = res.message.entrepot_id
      this.quantite_comptee = res.message.quantite_comptee
      this.quantite_initiale = res.message.quantite_initiale
      this.motif = res.message.motif
      this.action_recommande = res.message.action_recommande
      this.utilisateur_id = res.message.utilisateur_id
      this.type_produit = res.message.type_produit
      this.ecart = res.message.ecart
      this.variation_id = res.message.variation_id
      this.commentaire = res.message.commentaire
      this.combination_hash = res.message.combination_hash   
      this.getCombinaisonsByProdduit(this.produit_id)
         
    })
  }

  loadUsers() {
    const user: GetUser = { utilisateur_id: 0 };
    this.userService.getListUser(user).subscribe((data) => {
      console.log(data);
      this.utilisateurs = data.message;
    });
  }

  loadEntrepot() {
    const entrepot: GetEntrepot = { entrepot_id: 0 };
    this.entrepotService.getListEntrepot(entrepot).subscribe((data) => {
      console.log(data.message);
      this.entrepots = data.message;
    });
  }

  loadProduit() {
    const produit: GetProduit = { produit_id: 0 };
    this.produitService.getList(produit).subscribe((data) => {
      console.log(data.message);
      this.produits = data.message
    });
  }

  getUserName(utilisateur_id: number): string {
    const user = this.utilisateurs.find(u => u.utilisateur_id === utilisateur_id);
    return user ? user.nom_utilisateur + ' ' + user.prenom_utilisateur : 'Unknown User';
  }

  getProduitName(produit_id: number): string {
    const produit = this.produits.find((p) => p.produit_id === produit_id);
    return produit ? produit.nom : '';
  }

  getEntrepotName(entrepot_id: number): string {
    const entrepot = this.entrepots.find((e) => e.entrepot_id === entrepot_id);
    return entrepot ? entrepot.nom : '';
  }


  entrepotSelected(event: any){
    console.log(event.target.value);
    this.entrepotService.getListStockByEntrepotID(Number(event.target.value)).subscribe(res =>{
      console.log(res.message);
      this.produitsEntrepot = res.message
    })
    
  }

  selectProduit(event: any): void {
    const selectedId = event.target.value;
    console.log(selectedId);

  this.produitSelected = this.produitsEntrepot.find(
    (produit) => produit.produit_id === +selectedId
  );
 
    // Si l'objet est trouvé, affiche-le
    if (this.produitSelected) {
      console.log(this.produitSelected);
    } else {
      console.log('Aucun produit trouvé avec cet ID');
    }

    this.produitSelected = this.produitsEntrepot.find(
      (produit) => produit.produit_id === +selectedId
    );
    this.type_produit = this.produitSelected.type_produit
    console.log(this.type_produit);
    
    if (this.produitSelected.type_produit == "variable") {
      this.getCombinaisonsByProdduit(this.produitSelected.produit_id)
    }else{
      this.combination_hash = "######"
      this.quantite_initiale = this.produitSelected.quantite
      console.log(this.quantite_initiale);
    }
  }


  getQuantityStockProduitByPoint(point_de_vente_id: number, produit_id: number){
    this.entrepotService.getQuantiteProduitByStockPoint(point_de_vente_id,produit_id).subscribe(res =>{
      console.log(res.message);
    })

  }

  getCombinaisonsByProdduit(produit_id: number){
    const produit: GetProduit = {
      produit_id: this.produit_id
    };
    this.produitService.getCombinaisonByProduitId(produit).subscribe(res => {
      console.log(res.message);
      this.TbCombinaisons = res.message
      console.log(this.TbCombinaisons);
      
    });
  }

  selectCombination(event: any) {
    console.log(event.target.value);
    this.combination_hash = event.target.value;
  
    // Trouver la combinaison sélectionnée
    const selectedCombinationHash = event.target.value;
    const selectedCombination = this.TbCombinaisons.find(comb => comb.combination_hash === selectedCombinationHash);
    console.log(selectedCombination);
  
    if (selectedCombination) {
      this.variation_id = selectedCombination.id;
      console.log(this.variation_id);
  
      // Vérifier si le combination_hash existe dans le produitSelected
      if (this.produitSelected && this.produitSelected.combination_hash === selectedCombinationHash) {
        this.quantite_initiale = this.produitSelected.quantite;  // Tu peux utiliser cette valeur où tu en as besoin
      } else {
        this.globalService.toastShow("Le produit selectionné n'a pas cette combination dans le stock de l'entrepot","Information","info")
        this.quantite_initiale = 0
      }
    } else {
      this.globalService.toastShow("Aucune combinaison sélectionnée.","Information","info")
    }
  }
  

    onSubmitForm(form: NgForm){
    const inventaire: Inventaire = form.value;
    inventaire.utilisateur_id = this.user.utilisateur_id
    inventaire.combination_hash = this.combination_hash
    inventaire.variation_id = this.variation_id ? this.variation_id : 0
    console.log(inventaire);
    if (this.action == 'edit') {
      inventaire.id = this.id
      console.log(inventaire);
      
      this.entrepotService.UpdateInventaire(inventaire).subscribe(res =>{
        console.log(res.message);
        this.message = res.message
        this.globalService.toastShow(this.message,"Succès")
        this.router.navigateByUrl('/entrepot-stock-list')
      })
    }else{
      this.entrepotService.AddInventaire(inventaire).subscribe(res =>{
        console.log(res.message);
        this.message = res.message
        this.globalService.toastShow(this.message,"Succès")
        this.router.navigateByUrl('/entrepot-stock-list')
      })
    }
  }
}
