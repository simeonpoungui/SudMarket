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
  selector: 'app-categorie-depenses-form',
  templateUrl: './categorie-depenses-form.component.html',
  styleUrls: ['./categorie-depenses-form.component.scss']
})
export class CategorieDepensesFormComponent {
    action!:string;
    id_categorie!: number
    nom_categorie!:string
    description!: string
    tbUsers!: Utilisateur[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private categorieDepenseService: DepensesService,
    private globaService: GlobalService,
  ){}

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action']
    this.id_categorie = +this.route.snapshot.params['id']
    console.log(this.action,this.id_categorie);

    if (this.action === 'edit') {
      this.initFormCategorieDepense()
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


initFormCategorieDepense(){
  this.categorieDepenseService.getListCategoriesDepenses(this.id_categorie).subscribe(res =>{
    console.log(res.message);
    this.id_categorie = res.message.id_categorie
    this.nom_categorie = res.message.nom_categorie
    this.description = res.message.description
  })

  }

  //Submit form user
  onSubmitForm(form: NgForm){
    const categorie_depense: any = form.value;
    console.log(categorie_depense);
    if (this.action === 'edit') {
      categorie_depense.id_categorie = this.id_categorie
      
    this.categorieDepenseService.updateCategorieDepense(categorie_depense).subscribe(data => {
        console.log(data.message);
        this.globaService.toastShow(data.message,"Succès")
      })
    }else{
      this.categorieDepenseService.createCategorieDepense(categorie_depense).subscribe(data => {
        console.log(data.message);
        this.globaService.toastShow(data.message,"Succès")
      })
    }
  }
}
