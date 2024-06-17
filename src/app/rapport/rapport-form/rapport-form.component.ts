import { Component } from '@angular/core';
import { Rapport } from 'src/app/Models/rapport.model';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { RapportService } from 'src/app/Services/rapport.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
@Component({
  selector: 'app-rapport-form',
  templateUrl: './rapport-form.component.html',
  styleUrls: ['./rapport-form.component.scss'],
})
export class RapportFormComponent {
  action!: string;
  rapport!: Rapport;
  rapport_id!: number;
  type_rapport!: string;
  donnees!: string;
  nom_generateur!: string;
  message!: any;
  modifie_le: any;
  genere_le: any;

  constructor(
    private rapportService: RapportService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action'];
    console.log(this.action);
    const rapportJson = localStorage.getItem('selectedRapport');
    if (rapportJson) {
      this.rapport = JSON.parse(rapportJson);
    }
    if (this.action === 'edit') {
      this.initFormRapportUpdate();
    }
  }

  initFormRapportUpdate() {
    this.donnees = this.rapport.donnees;
    this.type_rapport = this.rapport.type_rapport;
    this.nom_generateur = this.rapport.nom_generateur;
    this.genere_le = this.rapport.genere_le;
    this.modifie_le = this.rapport.modifie_le;
  }

  onSubmitForm(form: NgForm) {
    const rapport: Rapport = form.value;
    console.log(rapport);
    
    if (this.action === 'edit') {
      rapport.rapport_id = this.rapport.rapport_id;
      this.rapportService.update(rapport).subscribe((data) => {
        console.log(data);
        this.message = data.message;
        this.router.navigateByUrl('rapport/list');
        this.globalService.toastShow(this.message, 'Succès', 'success');
      });
    } else {
      console.log(rapport);
      this.rapportService.create(rapport).subscribe((data) => {
        console.log(data);
        this.message = data.message;
        this.router.navigateByUrl('rapport/list');
        this.globalService.toastShow(this.message, 'Succès', 'success');
      });
    }
  }
}
