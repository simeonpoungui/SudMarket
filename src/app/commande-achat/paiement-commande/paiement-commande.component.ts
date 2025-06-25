import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCommandeAchat } from 'src/app/Models/commande.model';
import { Paiement } from 'src/app/Models/paiement.commande.model';
import { Utilisateur } from 'src/app/Models/users.model';
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
  statut?: string
  statut_validation?: string
  user!: Utilisateur;
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
    console.log(this.commande_achat_id);

    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);   
    }
    
    if (this.commande_achat_id) {
      this.getOneCommande()
    }
  }

  getOneCommande(){
    const commande: GetCommandeAchat = {
      commande_achat_id: this.commande_achat_id
    }
    this.commandeService.getOne(commande).subscribe(res =>{
      console.log(res.message);
      this.montant = res.message.montant_total
      this.statut = res.message.statut
      this.statut_validation = res.message.statut_validation
      
    })
  }

  onSubmitForm(form:NgForm){
    const paiement: Paiement = form.value
    paiement.point_de_vente_id = this.user.point_de_vente_id
    paiement.utilisateur_id = this.user.utilisateur_id
    console.log(paiement);
     this.commandeService.AddpaiementCommande(paiement).subscribe(res =>{
       console.log(res.message);
       this.globalService.toastShow(res.message,"Succès")
       this.router.navigateByUrl('paiement-commande-list')
     })
  }
}
