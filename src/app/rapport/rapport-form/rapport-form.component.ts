import { Component } from '@angular/core';
import { Rapport } from 'src/app/Models/rapport.model';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { RapportService } from 'src/app/Services/rapport.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Utilisateur } from 'src/app/Models/users.model';
import { GetVente } from 'src/app/Models/vente.model';
import { VenteService } from 'src/app/Services/vente.service';
import { GetDepense } from 'src/app/Models/depenses.model';
import { DepensesService } from 'src/app/Services/depenses.service';
import { GetCommandeAchat } from 'src/app/Models/commande.model';
import { CommandeService } from 'src/app/Services/commande.service';
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
  nom_destinataire!: string
  email_destinataire!: string
  user!: Utilisateur;

  constructor(
    private rapportService: RapportService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user = JSON.parse(utilisateurJson);
      console.log(this.user);
      this.nom_generateur = this.user.nom_utilisateur + ' ' + this.user.prenom_utilisateur
    }

    console.log(this.rapport);
    console.log(this.action);

    if (this.action === 'edit') {
      this.initFormRapportUpdate();
    }
  }

  initFormRapportUpdate() {
    this.type_rapport = this.rapport.type_rapport;
    this.nom_generateur = this.rapport.nom_generateur;
    this.nom_destinataire = this.rapport.nom_destinataire
    this.email_destinataire = this.rapport.email_destinataire
  }

  onSubmitForm(form: NgForm) {
    const rapport: Rapport = form.value;
    rapport.donnees = "Automatisées"
    console.log(rapport);
    if (this.action === 'edit') {
      rapport.rapport_id = this.rapport.rapport_id;
      this.rapportService.update(rapport).subscribe((data) => {
        console.log(data);
        if (data.code == "succes") {
          this.generateReport(rapport.type_rapport)
        }
        this.message = data.message;
        this.dialog.closeAll()
        this.globalService.toastShow(this.message, 'Succès', 'success');
      });
    } else {
      console.log(rapport);
      this.rapportService.create(rapport).subscribe((data) => {
        console.log(data);
        if (data.code == "succes") {
          this.generateReport(rapport.type_rapport)
        }
        this.dialog.closeAll()
        this.message = data.message;
        this.globalService.toastShow(this.message, 'Succès', 'success');
      });
    }
  }

  generateReport(type_rapport: string) {
    const reportData = {
      type_rapport:type_rapport
    };
    this.rapportService.generateReport(reportData).subscribe(response => {
      console.log(response);
    });
  }
  
}
