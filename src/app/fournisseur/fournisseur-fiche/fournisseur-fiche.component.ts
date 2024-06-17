import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Fournisseur } from 'src/app/Models/fournisseur.model';
import { FournisseurService } from 'src/app/Services/fournisseur.service';

@Component({
  selector: 'app-fournisseur-fiche',
  templateUrl: './fournisseur-fiche.component.html',
  styleUrls: ['./fournisseur-fiche.component.scss']
})
export class FournisseurFicheComponent {

  action:string = 'view';
  fournisseur!: Fournisseur;
  message!: any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private dialog: MatDialog,
    private fournisseurService: FournisseurService
  ){}

  ngOnInit(): void {
    console.log(this.action);
    const fournisseurJson = localStorage.getItem('selectedFournisseur');
    if (fournisseurJson) {
      this.fournisseur =  JSON.parse(fournisseurJson);
    }
  }
  updatefournisseur(){
    this.router.navigateByUrl('/fournisseur/edit')
  }

  deletefournisseur(){
    const alert = this.dialog.open(AlertComponent)
    alert.componentInstance.content = "Voulez-vous supprimé le fournissuer " + this.fournisseur.nom + ' ?'
    alert.componentInstance.backgroundColor = "danger"
    alert.afterClosed().subscribe(confirmDelete => {
      if (confirmDelete) {
        console.log(this.fournisseur);
        this.fournisseurService.delete(this.fournisseur).subscribe(data => {
          console.log(data.message);
          this.message = data.message
          this.router.navigateByUrl('/fournisseur/list')
          this.globalService.toastShow(this.message,'Succès','success')
        } )
      }
    })
  }
}
