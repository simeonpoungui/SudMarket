import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { GlobalService } from 'src/app/Services/global.service';
import { Fournisseur, GetFournisseur } from 'src/app/Models/fournisseur.model';
import { FournisseurService } from 'src/app/Services/fournisseur.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-fournisseur-form',
  templateUrl: './fournisseur-form.component.html',
  styleUrls: ['./fournisseur-form.component.scss']
})
export class FournisseurFormComponent {
  action!:string;
    fournisseur_id!: number;
    nom!: string;
    prenom!: string;
    sexe!: string;
    personne_de_contact!: string;
    email!: string;
    telephone!: string;
    adresse!: string;
    cree_le!: Date;
    message!: any
    fournisseur!: Fournisseur
    tbUsers!: Utilisateur[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private fournissuerService: FournisseurService,
    private globaService: GlobalService,
  ){}

  isFormValid(): any {
    return this.nom && this.email && this.telephone;
  }

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action']
    console.log(this.action);
    const fournisseuJSON = localStorage.getItem('selectedFournisseur');
    if (fournisseuJSON) {
      this.fournisseur =  JSON.parse(fournisseuJSON);
    }
    if (this.action === 'edit') {
      this.initFormFournisseur()
    }
    this.loadUsers()
  }

  loadUsers(){
    const user: GetUser = {utilisateur_id: 0}
    this.userService.getListUser(user).subscribe(data => {
      console.log(data);
      this.tbUsers = data.message
      console.log(this.tbUsers);
    } )
  }

//initialise form by info user
initFormFournisseur(){
    this.fournisseur_id = this.fournisseur.fournisseur_id
    this.nom = this.fournisseur.nom
    this.email = this.fournisseur.email
    this.telephone = this.fournisseur.telephone
    this.adresse = this.fournisseur.adresse
    this.personne_de_contact = this.fournisseur.personne_de_contact
    this.cree_le = this.fournisseur.cree_le
  }

  //Submit form user
  onSubmitForm(form: NgForm){
    const fournisseur: Fournisseur = form.value;
    if (this.action === 'edit') {
      fournisseur.fournisseur_id = this.fournisseur.fournisseur_id
      this.fournissuerService.update(fournisseur).subscribe(data => {
        console.log(data);
        this.message = data.message
        this.router.navigateByUrl('fournisseur/list')
        this.globaService.toastShow(this.message,'Succès','success')
      })
    }else{
      console.log(fournisseur);
      this.fournissuerService.create(fournisseur).subscribe(data => {
        console.log(data);
        this.message = data.message
        this.router.navigateByUrl('fournisseur/list')
        this.globaService.toastShow(this.message,'Succès','success')
      })
    }
  }
}
