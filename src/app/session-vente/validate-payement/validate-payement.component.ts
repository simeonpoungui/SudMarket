import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
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
  montant_total!: number
  selectedPayments: string[] = [];  
  mode_de_paiement!: string
  vente!: Vente
  facture!: Facture

  constructor(
    public globalService: GlobalService,
    private venteService: VenteService,
    private dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit(): void {
    const venteFromStorage = localStorage.getItem('vente');
    if (venteFromStorage) {
      const venteParsed = JSON.parse(venteFromStorage);
      console.log(venteParsed);
      this.vente = venteParsed
      this.montant_total = venteParsed.montant_total
    }
  }


  onPaymentSelect(payment: string) {
    // Ajouter ou supprimer l'élément
    if (!this.selectedPayments.includes(payment)) {
      this.selectedPayments.push(payment);
    } else {
      this.selectedPayments = this.selectedPayments.filter(item => item !== payment);
    }
  
    // Extraire le premier élément du tableau
    if (this.selectedPayments.length > 0) {
      const firstElement = this.selectedPayments[0]; // Le premier élément
      this.mode_de_paiement = firstElement
      console.log('Premier élément:', firstElement);
    }
  
    // Afficher le tableau modifié
    console.log(this.selectedPayments);
  }
  
  removePayment(index: number) {
    // Supprimer l'élément à l'index donné
    this.selectedPayments.splice(index, 1);
  
    // Extraire le premier élément du tableau
    if (this.selectedPayments.length > 0) {
      const firstElement = this.selectedPayments[0]; // Le premier élément
      this.mode_de_paiement = firstElement
      console.log('Premier élément après suppression:', firstElement);
    }
    // Afficher le tableau modifié
    console.log(this.selectedPayments); 
  }

  Valider(){
    this.vente.mode_de_paiement = this.mode_de_paiement
    console.log(this.vente);
    const dialog = this.dialog.open(AlertComponent)
    dialog.componentInstance.content = "Voulez-vous effectuer cette vente ?"
    dialog.afterClosed().subscribe(res =>{
      if (res) {
        this.venteService.create(this.vente).subscribe(res =>{
          console.log(res.message);
          if (res.code == "succes") {
            this.facture = res.facture
            const mode_de_paiementString = JSON.stringify(this.mode_de_paiement);
            localStorage.setItem('mode_de_paiement', mode_de_paiementString);
            const factureString = JSON.stringify(this.facture);
            localStorage.setItem('facture', factureString);
            this.router.navigateByUrl('/recu-vente')
          }
        })
      }
    })
  }
}
