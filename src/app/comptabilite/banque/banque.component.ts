import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Banque, GetBanque } from 'src/app/Models/banque.model';
import { CaissePrincipale, GetCaissePrincipale } from 'src/app/Models/caissePrincipale.model';
import { CaisseVendeur, GetCaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
import { CaissesService } from 'src/app/Services/caisses.service';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-banque',
  templateUrl: './banque.component.html',
  styleUrls: ['./banque.component.scss']
})
export class BanqueComponent {
  dataSource1!: any;
  displayedColumns1 = [
    'caisse_vendeur_id',
    'caisse_principale_id',
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
  
  banque_id!: number;
  nom_banque!: string;
  numero_compte!: string;
  ville!: string;
  adresse!: string;
  telephone!: string;
  solde!: number;
  date_creation!: Date;
  date_mise_a_jour!: Date;
  TotalMontant!: number
  constructor(
    private caisseService: CaissesService,
    private dialog: MatDialog,
    public globalService: GlobalService
  ) {}
  
  ngOnInit(): void {
    this.getCaissePrincipale();
    this.getListeTrabsefert();
    this.getListCaissePrincipale();
    this.getListCaisseVendeur()
    this.getListeTrabsefertBanque()
    this.getListBanque()

  }

  getListBanque(){
    const banque: GetBanque = {
      banque_id: 0
    }
    this.caisseService.getListBanque(banque).subscribe(data  => {
      console.log(data.message);
      this.tbBanque = data.message
      this.solde = data.message[0].solde
      this.nom_banque = data.message[0].nom_banque
      this.numero_compte = data.message[0].numero_compte
      this.ville = data.message[0].ville
      this.adresse= data.message[0].adresse
      this.telephone= data.message[0].telephone
      this.date_mise_a_jour= data.message[0].date_mise_a_jour
      this.date_creation= data.message[0].date_creation
    })
  }
  
  getListeTrabsefertBanque() {
    const transfert = {
        transfert_id: 0
    }
    this.caisseService.getTransfertCaisseBanque(transfert).subscribe(data => {
      console.log(data.message)
      this.TotalMontant = this.globalService.calculTotal('montant', data.message);
      this.dataSource2 = new MatTableDataSource(data.message)
    } )
  }

  getCaissePrincipale(){
    const caissep: GetCaissePrincipale = {
      caisse_principale_id: 0
    }
    this.caisseService.getListCaissePrincipale(caissep).subscribe(data => {
      console.log(data.message);

    })
  }

  getListCaissePrincipale() {
    const caisse: GetCaissePrincipale = {
      caisse_principale_id: 0
    }
    this.caisseService.getListCaissePrincipale(caisse).subscribe(data => {
      console.log(data.message);
      this.tbCaissePrincipale = data.message
    } )
  }

  getListCaisseVendeur() {
    const caisse : GetCaisseVendeur = {
      caisse_vendeur_id: 0
    }
    this.caisseService.getListCaisseVendeur(caisse).subscribe(data => {
      console.log(data.message);
      this.tbCaisseVendeur = data.message
    } )
  }

  getCaissevendeurName(caisse_vendeur_id: number): string {
    const caisse = this.tbCaisseVendeur.find(p => p.caisse_vendeur_id === caisse_vendeur_id);
    return caisse ? caisse.nom_caisse : 'Unknown Caisse';
  }

  getBanqueName(banque_id: number): string {
    const banque = this.tbBanque.find(p => p.banque_id === banque_id);
    return banque ? banque.nom_banque : 'Unknown Banque';
  }

  getCaissePrincippaleName(caisse_principale_id: number): string {
    const caisse = this.tbCaissePrincipale.find(p => p.caisse_principale_id === caisse_principale_id);
    return caisse ? caisse.nom_caisse : 'Unknown Caisse';
  }

  getListeTrabsefert() {
    const transfert = {
      transfert_id:0
    }
    this.caisseService.getListtransfertInterCaisseVendeurPrincipale(transfert).subscribe(data => {
      console.log(data.message)
      this.dataSource1 = new MatTableDataSource(data.message)
    } )
  }
}
