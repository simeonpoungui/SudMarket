import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { GlobalService } from 'src/app/Services/global.service';
import { Fournisseur, GetFournisseur } from 'src/app/Models/fournisseur.model';
import { FournisseurService } from 'src/app/Services/fournisseur.service';
import { UsersService } from 'src/app/Services/users.service';
import { DepensesService } from 'src/app/Services/depenses.service';


@Component({
  selector: 'app-sous-categorie-depenses-form',
  templateUrl: './sous-categorie-depenses-form.component.html',
  styleUrls: ['./sous-categorie-depenses-form.component.scss']
})
export class SousCategorieDepensesFormComponent {
  action!:string;
  id_sous_categorie!: number
  id_categorie!: number
  nom_sous_categorie!:string
  description!: string
  tbUsers!: Utilisateur[]
  Tbcategorie: any[] = []

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private userService: UsersService,
  private categorieDepenseService: DepensesService,
  private globaService: GlobalService,
){}

ngOnInit(): void {
  this.action = this.route.snapshot.params['action']
  this.id_sous_categorie = +this.route.snapshot.params['id']
  console.log(this.action,this.id_sous_categorie);

  if (this.action === 'edit') {
    this.initFormCategorieDepense()
  }
  this.loadUsers()
  this.getlistCategorie()
}

loadUsers(){
  const user: GetUser = {utilisateur_id: 0}
  this.userService.getListUser(user).subscribe(data => {
    console.log(data);
    this.tbUsers = data.message
    console.log(this.tbUsers);
  } )
}


getlistCategorie(){
  this.categorieDepenseService.getListCategoriesDepenses(0).subscribe(res =>{
    console.log(res.message);
    this.Tbcategorie = res.message
  })
}

initFormCategorieDepense(){  
this.categorieDepenseService.getListSousCategoriesDepenses(this.id_sous_categorie).subscribe(res =>{
  console.log(res.message);
  this.id_sous_categorie = res.message.id_sous_categorie
  this.id_categorie = res.message.id_categorie
  this.nom_sous_categorie = res.message.nom_sous_categorie
  this.description = res.message.description
})

}

//Submit form user
onSubmitForm(form: NgForm){
  const sous_categorie_depense: any = form.value;
  console.log(sous_categorie_depense);
  if (this.action === 'edit') {
    sous_categorie_depense.id_sous_categorie = this.id_sous_categorie
    
  this.categorieDepenseService.updateSousCategorieDepense(sous_categorie_depense).subscribe(data => {
      console.log(data.message);
      this.globaService.toastShow(data.message,"Succès")
    })
  }else{
    this.categorieDepenseService.createSousCategorieDepense(sous_categorie_depense).subscribe(data => {
      console.log(data.message);
      this.globaService.toastShow(data.message,"Succès")
    })
  }
}
}
