import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { Boutique } from 'src/app/Models/boutique.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { BoutiqueService } from 'src/app/Services/boutique.service';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-boutique-fiche',
  templateUrl: './boutique-fiche.component.html',
  styleUrls: ['./boutique-fiche.component.scss'],
})
export class BoutiqueFicheComponent {
  action: string = 'view';
  boutique!: Boutique;
  user!: Utilisateur
  logo: string = " "


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private boutiqueService: BoutiqueService
  ) {}

  ngOnInit(): void {
    // console.log(this.action);
    // const boutique = localStorage.getItem('boutique');
    // if (boutique) {
    //   this.boutique = JSON.parse(boutique);
    //   console.log(this.boutique);
    // }

    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
      console.log(this.user);
      this.loadOneBoutiqueByUserCoonected()
    }
  }

  loadOneBoutiqueByUserCoonected(){
    this.boutiqueService.getBoutiqueByPointDeVente(this.user.point_de_vente_id).subscribe(data => {
      console.log(data.message);
      this.boutique = data.message
    })
  }


  updateBoutique() {
    this.router.navigateByUrl('boutique-form/edit');
  }

  deleteBoutique() {
    const alert = this.dialog.open(AlertComponent);
    alert.componentInstance.content =
      'Voulez-vous supprimé cette boutique ' + this.boutique.nom + ' ?';
    alert.componentInstance.backgroundColor = 'danger';
    alert.afterClosed().subscribe((confirmDelete) => {
      if (confirmDelete) {
        console.log(this.boutique);
        this.boutiqueService.delete(this.boutique).subscribe((data) => {
          console.log(data.message);
          this.router.navigateByUrl('boutique-list');
          this.globalService.toastShow("Boutique supprimée", 'Succès', 'success');
        });
      }
    });
  }
}
