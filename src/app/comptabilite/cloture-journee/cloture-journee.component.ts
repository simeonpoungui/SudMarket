import { Component } from '@angular/core';
import { GetCaisseVendeur } from 'src/app/Models/caissevendeur.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { CaissesService } from 'src/app/Services/caisses.service';
import { GlobalService } from 'src/app/Services/global.service'

@Component({
  selector: 'app-cloture-journee',
  templateUrl: './cloture-journee.component.html',
  styleUrls: ['./cloture-journee.component.scss']
})
export class ClotureJourneeComponent {
  user!: Utilisateur;
  date_comptable!: any;
  historique_caisse_id!: number;
  caisse_vendeur_id!: number;
  solde_ouverture!: string;
  solde_fermeture!: string;
  TotalRetraits!: string;
  TotalVersements!: string;
  solde_confirme!: boolean;
  commentaires!: string;
  caisse!: string;
  constructor(private caisseService: CaissesService, public globalService: GlobalService) {}

  ngOnInit(): void {
    this.getCurrentDateFormatted();
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
    this.getCaisseVendeur();
  }

  getCurrentDateFormatted() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    this.date_comptable = `${year}-${month}-${day}`;
    console.log(this.date_comptable);
    //  console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  }

  getCaisseVendeur() {
    const user: GetUser = {
      utilisateur_id: this.user.utilisateur_id,
    };
    this.caisseService.getCaisseByUser(user).subscribe((data) => {
      console.log(data.message);
      this.caisse = data.message.nom_caisse;
      this.caisse_vendeur_id = data.message.caisse_vendeur_id
      this.getInfoByJourneeComptable(
        data.message.caisse_vendeur_id,
        this.date_comptable
      );
    });
  }
  getInfoByJourneeComptable(IDcaisse: number, date_comptable: Date) {
    this.caisseService.getinfocaisseJourneeComptable(IDcaisse, date_comptable).subscribe((data) => {
        console.log(data.message);
        this.caisse_vendeur_id = data.message.caisse_vendeur_id;
        this.solde_ouverture = data.message.solde_ouverture;
        this.solde_fermeture = data.message.solde_fermeture;
        this.TotalRetraits = data.message.TotalRetraits;
        this.TotalVersements = data.message.TotalVersements;
        this.solde_confirme = data.message.solde_confirme;
        this.commentaires = data.message.commentaires;
      });
  }

  selectDate(event: any){
    console.log(event.target.value);
    this.caisseService.getSoldeCaisseByDateComptable(event.target.value).subscribe(data  => {
      console.log(data.message);
      this.solde_ouverture = data.message.solde_ouverture;
      this.solde_fermeture = data.message.solde_fermeture;
      this.TotalRetraits = data.message.TotalRetraits;
      this.TotalVersements = data.message.TotalVersements;
      this.solde_confirme = data.message.solde_confirme;
      this.commentaires = data.message.commentaires;
      console.log( this.solde_ouverture);

    })    
  }

  confirmeSolde(){

  }
  
  ClotureJourneeComptable(){
   const vendeur : GetCaisseVendeur = {
     caisse_vendeur_id: this.caisse_vendeur_id,
     date_comptable: this.date_comptable
   }
   console.log(vendeur);
   this.caisseService.clotureJourneeComptable(vendeur).subscribe(data => {
    console.log(data);
   })
   
  }
}
