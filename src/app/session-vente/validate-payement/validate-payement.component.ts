import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectClientComponent } from 'src/app/client/select-client/select-client.component';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { Client } from 'src/app/Models/clients.model';
import { Facture, Vente } from 'src/app/Models/vente.model';
import { GlobalService } from 'src/app/Services/global.service';
import { VenteService } from 'src/app/Services/vente.service';

@Component({
  selector: 'app-validate-payement',
  templateUrl: './validate-payement.component.html',
  styleUrls: ['./validate-payement.component.scss']
})
export class ValidatePayementComponent {
  payments = [
    'Espèces',
    'Carte bancaire ',
    'Mobile Money'
  ];
  montant_total!: number;
  selectedPayments: string[] = [];  
  mode_de_paiement!: string;
  vente!: Vente;
  facture!: Facture;
  clientSelected!: Client;

  constructor(
    public globalService: GlobalService,
    private venteService: VenteService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const venteFromStorage = localStorage.getItem('vente');
    if (venteFromStorage) {
      const venteParsed = JSON.parse(venteFromStorage);
      this.vente = venteParsed;
      this.montant_total = venteParsed.montant_total;
    }
  }

  back() {
    window.history.back();
  }
  
  onPaymentSelect(payment: string) {
    if (!this.selectedPayments.includes(payment)) {
      this.selectedPayments.push(payment);
    } else {
      this.selectedPayments = this.selectedPayments.filter(item => item !== payment);
    }

    if (this.selectedPayments.length > 0) {
      const firstElement = this.selectedPayments[0]; 
      this.mode_de_paiement = firstElement;
    }

    console.log(this.selectedPayments);
  }

  removePayment(index: number) {
    this.selectedPayments.splice(index, 1);

    if (this.selectedPayments.length > 0) {
      const firstElement = this.selectedPayments[0]; 
      this.mode_de_paiement = firstElement;
    }

    console.log(this.selectedPayments); 
  }

  Valider() {
    this.vente.mode_de_paiement = this.mode_de_paiement;
    console.log(this.vente);
    const dialog = this.dialog.open(AlertComponent);
    dialog.componentInstance.content = "Voulez-vous effectuer cette vente ?";
    dialog.afterClosed().subscribe(res => {
       if (res) {
         this.venteService.create(this.vente).subscribe(res => {
           console.log(res);
          
           if (res.code == "succes") {
             this.facture = res.facture;
             localStorage.setItem('mode_de_paiement', JSON.stringify(this.mode_de_paiement));
             localStorage.setItem('facture', JSON.stringify(this.facture));
             this.router.navigateByUrl('/recu-vente');
           }
         });
       }
    });
  }

  chooseClient() {
    const dialog = this.dialog.open(SelectClientComponent);
    dialog.id = 'SelectClientComponent';
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.clientSelected = dialog.componentInstance.clientSelected;
      }
    });
  }
}
