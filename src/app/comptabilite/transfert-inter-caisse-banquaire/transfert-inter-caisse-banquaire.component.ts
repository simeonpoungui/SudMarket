import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Banque, GetBanque } from 'src/app/Models/banque.model';
import { CaissePrincipale, GetCaissePrincipale } from 'src/app/Models/caissePrincipale.model';
import { GetCaisseVendeur } from 'src/app/Models/caissevendeur.model';
import { CaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
import { TransfertCaisseBanque } from 'src/app/Models/transfert-inter-caisse-banquaire.model';
import { TransfertCaisse } from 'src/app/Models/transfert-inter-caisse.model';
import { CaissesService } from 'src/app/Services/caisses.service';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-transfert-inter-caisse-banquaire',
  templateUrl: './transfert-inter-caisse-banquaire.component.html',
  styleUrls: ['./transfert-inter-caisse-banquaire.component.scss']
})
export class TransfertInterCaisseBanquaireComponent {

  dataSource!: any;
  displayedColumns = [
    'caisse_principale_id',
    'banque_id',
    'montant',
    'description',
    'date_transfert',
  ];

  isloadingpage!: boolean;
  tbCaissePrincipale!: CaissePrincipale[]
  tbBanque!: Banque[]

  transfert_id!: number;
  caisse_principale_id!: number;
  banque_id!: number;
  montant!: number;
  description!: string;
  date_transfert!: Date;

  constructor(
    private router: Router,
    public globalService: GlobalService,
    private caisseService: CaissesService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListCaissePrincipale();
    this.getListBanque();
    this.getListeTrabsefert();

  }

  getListCaissePrincipale() {
    const caisse: GetCaissePrincipale = {
      caisse_principale_id: 0
    }
    this.caisseService.getListCaissePrincipale(caisse).subscribe(data => {
      console.log(data.message);
      this.caisse_principale_id = data.message[0].caisse_principale_id
      this.tbCaissePrincipale = data.message
      
    } )
  }

  getListBanque() {
    const banque : GetBanque = {
      banque_id: 0
    }
    this.caisseService.getListBanque(banque).subscribe(data => {
      console.log(data.message);
      this.banque_id = data.message[0].banque_id
      this.tbBanque = data.message
    } )
  }

  getCaissevendeurName(banque_id: number): string {
    const banque = this.tbBanque.find(p => p.banque_id === banque_id);
    return banque ? banque.nom_banque : 'Unknown Banque';
  }

  getCaissePrincippaleName(caisse_principale_id: number): string {
    const caisse = this.tbCaissePrincipale.find(p => p.caisse_principale_id === caisse_principale_id);
    return caisse ? caisse.nom_caisse : 'Unknown Caisse';
  }

  getListeTrabsefert() {
    const transfert = {
        transfert_id: 0
    }
    this.caisseService.getTransfertCaisseBanque(transfert).subscribe(data => {
      console.log(data.message)
      this.dataSource = new MatTableDataSource(data.message)
    } )
  }

  selectBanque(event : any){
    this.banque_id = Number(event.target.value)
  }  

  selectCaissePrincipale(event: any){
    this.caisse_principale_id = Number(event.target.value)
  }

  onSubmitForm(form: NgForm){
    const transfert:  TransfertCaisseBanque = form.value
    transfert.caisse_principale_id = this.caisse_principale_id
    transfert.banque_id = this.banque_id
    console.log(transfert);
     this.caisseService.TransfertCaisseBanque(transfert).subscribe(response => {
       console.log(response.message);
       this.getListeTrabsefert()
       this.globalService.toastShow(response.message,"Succès")
     })
  }

}
