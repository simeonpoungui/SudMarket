import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CaissePrincipale, GetCaissePrincipale } from 'src/app/Models/caissePrincipale.model';
import { GetCaisseVendeur } from 'src/app/Models/caissevendeur.model';
import { CaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
import { TransfertCaisse } from 'src/app/Models/transfert-inter-caisse.model';
import { CaissesService } from 'src/app/Services/caisses.service';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-transfert-inter-caisse',
  templateUrl: './transfert-inter-caisse.component.html',
  styleUrls: ['./transfert-inter-caisse.component.scss'],
})
export class TransfertInterCaisseComponent {
  dataSource!: any;
  displayedColumns = [
    'caisse_vendeur_id',
    'caisse_principale_id',
    'montant',
    'description',
    'date_transfert',
  ];


  isloadingpage!: boolean;
  tbCaissePrincipale!: CaissePrincipale[]
  tbCaisseVendeur!: CaisseVendeur[]

  caisse_vendeur_id!: number
  caisse_principale_id!: number
  montant!: number;
  description!: string; 
  date_transfert!: Date; 
  TotalMontant!: number
  
  constructor(
    private router: Router,
    public globalService: GlobalService,
    private caissService: CaissesService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListeTrabsefert();
    this.getListCaissePrincipale();
    this.getListCaisseVendeur();
  }

  getListCaissePrincipale() {
    const caisse: GetCaissePrincipale = {
      caisse_principale_id: 0
    }
    this.caissService.getListCaissePrincipale(caisse).subscribe(data => {
      console.log(data.message);
      this.tbCaissePrincipale = data.message
    } )
  }

  getListCaisseVendeur() {
    const caisse : GetCaisseVendeur = {
      caisse_vendeur_id: 0
    }
    this.caissService.getListCaisseVendeur(caisse).subscribe(data => {
      console.log(data.message);
      this.tbCaisseVendeur = data.message
    } )
  }

  getCaissevendeurName(caisse_vendeur_id: number): string {
    const caisse = this.tbCaisseVendeur.find(p => p.caisse_vendeur_id === caisse_vendeur_id);
    return caisse ? caisse.nom_caisse : 'Unknown Caisse';
  }

  getCaissePrincippaleName(caisse_principale_id: number): string {
    const caisse = this.tbCaissePrincipale.find(p => p.caisse_principale_id === caisse_principale_id);
    return caisse ? caisse.nom_caisse : 'Unknown Caisse';
  }

  getListeTrabsefert() {
    const transfert = {
      transfert_id:0
    }
    this.caissService.getListtransfertInterCaisseVendeurPrincipale(transfert).subscribe(data => {
      console.log(data.message)
      this.TotalMontant = this.globalService.calculTotal('montant', data.message);
      this.dataSource = new MatTableDataSource(data.message)
    } )
  }

  selectCaisseVendeur(event : any){
    this.caisse_vendeur_id = Number(event.target.value)
  }  

  selectCaissePrincipale(event: any){
    this.caisse_principale_id = Number(event.target.value)
  }

  onSubmitForm(form: NgForm){
    const transfert:  TransfertCaisse = form.value
    transfert.caisse_principale_id = this.caisse_principale_id
    transfert.caisse_vendeur_id = this.caisse_vendeur_id
    console.log(transfert);
    this.caissService.transfertInterCaisseVendeurPrincipale(transfert).subscribe(response => {
      console.log(response.message);
      this.globalService.toastShow(response.message,"Succès")
    })
  }
}
