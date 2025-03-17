import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Paiement } from 'src/app/Models/paiement.commande.model';
import { CommandeService } from 'src/app/Services/commande.service';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-paiement-commande',
  templateUrl: './paiement-commande.component.html',
  styleUrls: ['./paiement-commande.component.scss']
})
export class PaiementCommandeComponent {

  paiement_id!: number;
  commande_achat_id!: number;
  montant!: number;
  date_paiement!: Date;
  mode_paiement!: string;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private commandeService: CommandeService,
    private globalService: GlobalService
  ){}

  ngOnInit(): void {
    const commande_achat_id = +this.route.snapshot.params['idcommande']
    this.commande_achat_id = commande_achat_id
  }

  onSubmitForm(form:NgForm){
    const paiement: Paiement = form.value
    console.log(paiement);
    this.commandeService.AddpaiementCommande(paiement).subscribe(res =>{
      console.log(res.message);
      this.globalService.toastShow(res.message,"Succès")
      this.router.navigateByUrl('paiement-commande-list')
    })
  }
}
