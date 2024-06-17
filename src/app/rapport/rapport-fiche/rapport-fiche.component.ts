import { Component } from '@angular/core';
import { Rapport } from 'src/app/Models/rapport.model';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { RapportService } from 'src/app/Services/rapport.service';
import { RapportFormComponent } from '../rapport-form/rapport-form.component';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rapport-fiche',
  templateUrl: './rapport-fiche.component.html',
  styleUrls: ['./rapport-fiche.component.scss']
})
export class RapportFicheComponent {
  action!: string
  rapport!: Rapport
  rapport_id!: number;
  type_rapport!: string;
  donnees!: string;
  nom_generateur!: string
  message!: any
  genere_le!: Date;
  modifie_le!: Date

    constructor(
    private rapportService: RapportService,
    private dialog: MatDialog,
    private router: Router,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    const rapportJson = localStorage.getItem('selectedRapport');
    if (rapportJson) {
      this.rapport =  JSON.parse(rapportJson);
    }
  }

  updateRapport(){
    this.router.navigateByUrl('/rapport/edit')
  }

  deleteRapport() {
    const alert = this.dialog.open(AlertComponent);
    alert.componentInstance.content =
      'Voulez-vous supprimé le ' + this.rapport.type_rapport + ' ?';
    alert.componentInstance.backgroundColor = 'danger';
    alert.afterClosed().subscribe((confirmDelete) => {
      if (confirmDelete) {
        console.log(this.rapport);
        this.rapportService.delete(this.rapport).subscribe((data) => {
          console.log(data.message);
          this.message = data.message
          this.dialog.closeAll();
          this.router.navigateByUrl('/rapport/list');
          this.globalService.toastShow(this.message,'Succès','success');
        });
      }
    });
  }
}
