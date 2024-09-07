import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Banque, GetBanque } from 'src/app/Models/banque.model';
import { CaissePrincipale, GetCaissePrincipale } from 'src/app/Models/caissePrincipale.model';
import { CaisseVendeur, GetCaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { CaissesService } from 'src/app/Services/caisses.service';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-caisse-principale',
  templateUrl: './caisse-principale.component.html',
  styleUrls: ['./caisse-principale.component.scss']
})
export class CaissePrincipaleComponent {

  dataSource1!: any;
  displayedColumns1 = [
    'point_de_vente_id',
    'Utilisateur',
    'caisse_vendeur_id',
    // 'caisse_principale_id',
    'montant',
    // 'description',
    'date_transfert',
  ];

  dataSource2!: any;
  displayedColumns2 = [
    'caisse_principale_id',
    'banque_id',
    'montant',
    // 'description',
    'date_transfert',
  ];

  tbCaissePrincipale!: CaissePrincipale[]
  tbCaisseVendeur!: CaisseVendeur[]
  tbBanque!: Banque[]
  tbPointdeVente!: PointsDeVentes[];
  tbUser!: Utilisateur[]

  nom_caisse!:  string;
  montant_debit!: number;
  montant_credit!: number;
  description!: string; 
  solde!: number;
  banque_id!: number
  cree_le!: Date; 
  mis_a_jour_le!: Date; 

  TotalMontantTransfertCaissePrincipale!: number
  TotalMontantTransfertBanque!: number
  
  constructor(
    private caisseService: CaissesService,
    private dialog: MatDialog,
    private userService: UsersService,
    private pointService: PointsDeVentesService,
    public globalService: GlobalService
  ) {}
  
  ngOnInit(): void {
    this.getCaissePrincipale();
    this.getListeTransfert();
    // this.getListCaissePrincipale();
    this.getListCaisseVendeur()
    this.getListeTrabsefertBanque()
    this.getListBanque()
    this.loadUser()
    this.loadPointDeVente()
  }

  loadPointDeVente() {
    const point: GetPointsDeVentes = { point_de_vente_id: 0 };
    this.pointService.getList(point).subscribe((data) => {
      console.log(data.message);
      this.tbPointdeVente = data.message;
    });
  }


  loadUser(){
    const user: GetUser = {
      utilisateur_id: 0
    }
    this.userService.getListUser(user).subscribe(data => {
      console.log(data.message);
      this.tbUser = data.message
    } )
  }

  getListBanque(){
    const banque: GetBanque = {
      banque_id: 0
    }
    this.caisseService.getListBanque(banque).subscribe(data  => {
      console.log(data.message);
      this.tbBanque = data.message
    })
  }

  getListeTrabsefertBanque() {
    const transfert = {
        transfert_id: 0
    }
    this.caisseService.getTransfertCaisseBanque(transfert).subscribe(data => {
      console.log(data.message)
      this.TotalMontantTransfertBanque = this.globalService.calculTotal('montant', data.message);
      this.dataSource2 = new MatTableDataSource(data.message)
    } )
  }


  getListeTransfert() {
    const transfert = {
      transfert_id:0
    }
    this.caisseService.getListtransfertInterCaisseVendeurPrincipale(transfert).subscribe(data => {
      console.log(data.message)
      this.TotalMontantTransfertCaissePrincipale = this.globalService.calculTotal('montant', data.message);
      this.dataSource1 = new MatTableDataSource(data.message)
    } )
  }
  
  getCaissePrincipale(){
    const caissep: GetCaissePrincipale = {
      caisse_principale_id: 0
    }
    this.caisseService.getListCaissePrincipale(caissep).subscribe(data => {
      console.log(data.message);
      this.tbCaissePrincipale = data.message
      this.solde = data.message[0].solde
      this.nom_caisse = data.message[0].nom_caisse
      this.montant_credit = data.message[0].montant_credit
      this.montant_debit = data.message[0].montant_debit
      this.banque_id= data.message[0].banque_id
      this.description= data.message[0].description
      this.cree_le= data.message[0].cree_le
      this.mis_a_jour_le= data.message[0].mis_a_jour_le
    })
  }

  // getListCaissePrincipale() {
  //   const caisse: GetCaissePrincipale = {
  //     caisse_principale_id: 0
  //   }
  //   this.caisseService.getListCaissePrincipale(caisse).subscribe(data => {
  //     console.log(data.message);
  //   } )
  // }

  getListCaisseVendeur() {
    const caisse : GetCaisseVendeur = {
      caisse_vendeur_id: 0
    }
    this.caisseService.getListCaisseVendeur(caisse).subscribe(data => {
      console.log(data.message);
      this.tbCaisseVendeur = data.message
    } )
  }

  SelectedPointDeVente(event: any){
    console.log(event.target.value);
    
  }

  getCaissevendeurName(caisse_vendeur_id: number): string {
    const caisse = this.tbCaisseVendeur.find(p => p.caisse_vendeur_id === caisse_vendeur_id);
    return caisse ? caisse.nom_caisse : 'Unknown Caisse';
  }

  getCaissevendeurIdUser(caisse_vendeur_id?: number) {
    const caisse = this.tbCaisseVendeur.find(p => p.caisse_vendeur_id === caisse_vendeur_id);
    if (caisse) {
      const user = this.tbUser.find(u => u.utilisateur_id === caisse.utilisateur_id);
      return user ? user.nom_utilisateur + ' ' + user.prenom_utilisateur : 'Unknown User';
    }
    return 'Unknown Caisse';
  }

  getCaissevendeurIdPointDeVente(caisse_vendeur_id?: number) {
    const caisse = this.tbCaisseVendeur.find(p => p.caisse_vendeur_id === caisse_vendeur_id);
    if (caisse) {
      const point = this.tbPointdeVente.find(u => u.point_de_vente_id === caisse.point_de_vente_id);
      return point ? point.nom : 'Unknown Point';
    }
    return 'Unknown Caisse';
  }


  getBanqueName(banque_id: number): string {
    const banque = this.tbBanque.find(p => p.banque_id === banque_id);
    return banque ? banque.nom_banque : 'Unknown Banque';
  }

  getCaissePrincippaleName(caisse_principale_id: number): string {
    const caisse = this.tbCaissePrincipale.find(p => p.caisse_principale_id === caisse_principale_id);
    return caisse ? caisse.nom_caisse : 'Unknown Caisse';
  }


}
