import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Boutique } from 'src/app/Models/boutique.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { BoutiqueService } from 'src/app/Services/boutique.service';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-boutique-form',
  templateUrl: './boutique-form.component.html',
  styleUrls: ['./boutique-form.component.scss'],
})
export class BoutiqueFormComponent {
  action!: string;
  boutique!: Boutique;
  boutique_id!: number;
  nom!: string;
  adresse!: string;
  telephone!: string;
  responsable!: string;
  date_creation!: Date;
  user!: Utilisateur;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globaService: GlobalService,
    private boutiqueService: BoutiqueService
  ) {}

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  logo: any | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action'];
    console.log(this.action);
    const utilisateurJson = localStorage.getItem('user');
    if (utilisateurJson) {
      this.user = JSON.parse(utilisateurJson);
      console.log(this.user);
    }

    if (this.action === 'edit') {
      this.initFomForBoutique();
    }
  }


  initFomForBoutique() {
    this.boutiqueService
      .getBoutiqueByPointDeVente(this.user.point_de_vente_id)
      .subscribe((data) => {
        console.log(data.message);
        this.boutique_id = data.message.boutique_id;
        this.nom = data.message.nom;
        this.adresse = data.message.adresse;
        this.logo = data.message.logo;
        this.telephone = data.message.telephone;
        this.responsable = data.message.responsable;
      });
  }

  onSubmitForm(form: NgForm) {
    const boutique: Boutique = form.value;
    boutique.logo = this.logo;
    console.log(boutique);
    if (this.action === 'edit') {
      boutique.boutique_id = this.boutique_id;
      this.boutiqueService.update(boutique).subscribe((data) => {
        console.log(data);
        this.router.navigateByUrl('boutique-fiche');
        this.globaService.toastShow('Boutique modifiée', 'Succès', 'success');
      });
    } else {
      this.boutiqueService.create(boutique).subscribe((data) => {
        console.log(data);
        this.router.navigateByUrl('boutique-fiche');
        this.globaService.toastShow('Boutique ajoutée', 'Succès', 'success');
      });
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.logo = e.target?.result;
        console.log(this.logo);

        this.convertToBase64(file);
      };
      reader.readAsDataURL(file);
    }
  }
  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      console.log('Base64 String - ', base64String);
    };
    reader.readAsDataURL(file);
  }
}
