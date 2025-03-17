import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Entrepot, GetEntrepot } from 'src/app/Models/entrepot.model';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { EntrepotService } from 'src/app/Services/entrepot.service';
import { GlobalService } from 'src/app/Services/global.service';
import { UsersService } from 'src/app/Services/users.service';


@Component({
  selector: 'app-entrepot-form',
  templateUrl: './entrepot-form.component.html',
  styleUrls: ['./entrepot-form.component.scss']
})

export class EntrepotFormComponent {

  action!:string;
  entrepot_id!: number
  nom!: string;
  adresse!: string;
  responsable!: string;
  telephone!: string;
  ville!: string;
  email!: string;
  capacite_stockage!: number;
  message!: any
  tbUsers: Utilisateur[] = []

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private userService: UsersService,
  private entrepotService: EntrepotService,
  private globaService: GlobalService,
){}

isFormValid(): any {
  return this.nom && this.adresse && this.responsable;
}

ngOnInit(): void {
  this.action = this.route.snapshot.params['action']
  this.entrepot_id = this.route.snapshot.params['id']
  console.log(this.action,this.entrepot_id);

  if (this.action === 'edit') {
    this.initFormEntrepot()
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

initFormEntrepot(){
  const entrepot: GetEntrepot = {
    entrepot_id: this.entrepot_id
  }
  this.entrepotService.getOneEntrepot(entrepot).subscribe(res =>{
    console.log(res.message);
    this.nom = res.message.nom
    this.adresse = res.message.adresse
    this.responsable = res.message.responsable
    this.telephone = res.message.telephone
    this.ville = res.message.ville
    this.email = res.message.email
    this.capacite_stockage = res.message.capacite_stockage
  })
}

//Submit form user
onSubmitForm(form: NgForm){
  const entrepot: Entrepot = form.value;
  console.log(entrepot);
  if (this.action === 'edit') {
    entrepot.entrepot_id = this.entrepot_id
    this.entrepotService.updateEntrepot(entrepot).subscribe(data => {
      console.log(data);
      this.message = data.message
      this.router.navigateByUrl('entrepot-list')
      this.globaService.toastShow(this.message,'Succès','success')
    })
  }else{
    console.log(entrepot);
    this.entrepotService.createEntrepot(entrepot).subscribe(data => {
      console.log(data);
      this.message = data.message
      this.router.navigateByUrl('entrepot-list')
      this.globaService.toastShow(this.message,'Succès','success')
    })
  }
}
}
