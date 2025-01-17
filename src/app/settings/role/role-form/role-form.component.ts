import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Role } from 'src/app/Models/role.model';
import { GlobalService } from 'src/app/Services/global.service';
import { RoleService } from 'src/app/Services/role.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent {
  action!: string;
  role!: Role;
  roleString !: string
  role_id!: number;
  nom_role!: string;
  openBycomponentRole!: boolean
  permissions!: string[];
  roles: string[] = ['Admin', 'User', 'Guest']; 

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    console.log(this.role);
    console.log(this.action);
    console.log(this.openBycomponentRole);
    
    if (this.action === 'edit') {
      this.initFormRoleUpdate();
    }
  }
  
  initFormRoleUpdate() {
    (this.nom_role = this.role.nom_role),
    (this.permissions = this.role.permissions);
  }

  onSubmitForm(form: NgForm) {
    const role: Role = form.value;
    console.log(role);
    if (this.action === 'edit') {
      role.role_id = this.role.role_id
      this.roleService.updateRole(role).subscribe(data => {
        console.log(data);
        this.dialog.getDialogById('RoleFormComponent')?.close(true)
        this.globalService.toastShow('Mise à jour effectuée','Succès','success')
      })
    }else{
      const formValues = form.value;
      const permissionsArray = formValues.permissions.split(',').map((perm: string) => perm.trim());
      const role: Role = {
        role_id: 1,
        nom_role: formValues.nom_role,
        permissions: permissionsArray
      };
      console.log(role);
       this.roleService.createRole(role).subscribe(data => {
         console.log(data);
         if (this.openBycomponentRole == true) {
          this.roleString = data.message.nom_role
          console.log(this.roleString);
          this.dialog.getDialogById('RoleFormComponent')?.close(true)
         }
         this.dialog.getDialogById('RoleFormComponent')?.close(true)
         this.globalService.toastShow('Role ajouté avec succès','Succès','success')
       })
    }
  }
}
