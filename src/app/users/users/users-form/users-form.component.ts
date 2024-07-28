import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GetUser, ImageUser, Utilisateur } from 'src/app/Models/users.model';
import { GlobalService } from 'src/app/Services/global.service';
import { UsersService } from 'src/app/Services/users.service';
import { GetRole, Role } from 'src/app/Models/role.model';
import { RoleService } from 'src/app/Services/role.service';
import { GetPointsDeVentes, PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
})
export class UsersFormComponent {

  @Input() action!:string;
  user!: Utilisateur;
  utilisateur_id!: number;
  nom_utilisateur!: string;
  prenom_utilisateur?: string;
  mot_de_passe_hash!: string;
  email?: string;
  telephone?: string;
  sexe?: string;
  adresse?: string;
  nationalite?: string;
  role!: string;
  cree_le?: Date;
  mis_a_jour_le?: Date;
  message!: any
  TabRole!: Role[]
  tbPointdeVente!: PointsDeVentes[]
  point_de_vente_id?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pointService: PointsDeVentesService,
    private roleService: RoleService,
    private globaService: GlobalService,
    private userService: UsersService
  ){}

  isFormValid(): any {
    return this.nom_utilisateur && this.prenom_utilisateur && this.email && this.telephone && this.sexe && this.role;
  }

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  image: any | ArrayBuffer | null = null;
  
  ngOnInit(): void {
    this.action = this.route.snapshot.params['action']
    console.log(this.action);
    const utilisateurJson = localStorage.getItem('selectedUtilisateur');
    if (utilisateurJson) {
      this.user =  JSON.parse(utilisateurJson);
    }
    if (this.action === 'edit') {
      this.initFomForUser()
      this.getImageUserID()
    }
    this.loadRole()
    this.loadPointDeVente()
  }
  
  getImageUserID(){
    const user: GetUser = {utilisateur_id: this.user.utilisateur_id}
    this.userService.getImageByUser(user).subscribe(data => {
      console.log(data.message);
      this.image = data.message
    })
  }

  sendImageByUser(){
    const model: ImageUser = {
      utilisateur_id: this.user.utilisateur_id,
      image: this.image
    }
    this.userService.updateCreateImageByUser(model).subscribe(data => {
      console.log(data.message);
    })
  }

  loadPointDeVente(){
    const point: GetPointsDeVentes = {point_de_vente_id:0}
    this.pointService.getList(point).subscribe(data => {
      console.log(data.message);
      this.tbPointdeVente = data.message
      
    } )
  }

  getPointName(point_de_vente_id: any): string {
    const point = this.tbPointdeVente.find(p => p.point_de_vente_id === point_de_vente_id);
    return point ? point.nom : 'Unknown Point';
  }
  
  loadRole(){
    const role: GetRole = {role_id:0}
    this.roleService.getListRole(role).subscribe(data =>{
      this.TabRole = data.message
      console.log(this.TabRole);
    })
  }

//initialise form by info user
  initFomForUser(){
    this.utilisateur_id = this.user.utilisateur_id
    this.nom_utilisateur = this.user.nom_utilisateur
    this.prenom_utilisateur = this.user.prenom_utilisateur
    this.mot_de_passe_hash = this.user.mot_de_passe_hash
    this.point_de_vente_id = this.user.point_de_vente_id,
    this.email = this.user.email
    this.telephone = this.user.telephone
    this.sexe = this.user.sexe
    this.adresse = this.user.adresse
    this.nationalite = this.user.nationalite
    this.role = this.user.role
    this.cree_le = this.user.cree_le
    this.mis_a_jour_le = this.user.mis_a_jour_le
  }

  //Submit form user
  onSubmitForm(form: NgForm){
    const user: Utilisateur = form.value;
    user.mot_de_passe_hash = this.user.mot_de_passe_hash
    if (this.action === 'edit') {
      user.utilisateur_id = this.user.utilisateur_id
      this.userService.updateUser(user).subscribe(data => {
        console.log(data);
        this.message = data.message
        this.router.navigateByUrl('user/list')
        this.globaService.toastShow(this.message,'Succès','success')
        this.sendImageByUser()

      })
    }else{
      console.log(user);
      this.userService.createUser(user).subscribe(data => {
        console.log(data);
        this.message = data.message
        this.router.navigateByUrl('user/list')
        this.globaService.toastShow("Utilisateur crée avec succès",'Succès','success')
        const model: ImageUser = {
          utilisateur_id: Number(data.message),
          image: this.image
        }
        console.log(model);
        this.userService.updateCreateImageByUser(model).subscribe(data => {
          console.log(data.message);
        })
      })
    }
  }

  //image user

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.image = e.target?.result;
        console.log(this.image);
        
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
