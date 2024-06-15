import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Role } from 'src/app/Models/role.model';
import { GlobalService } from 'src/app/Services/global.service';
import { RoleService } from 'src/app/Services/role.service';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { RoleFormComponent } from '../role-form/role-form.component';

@Component({
  selector: 'app-fiche-role',
  templateUrl: './fiche-role.component.html',
  styleUrls: ['./fiche-role.component.scss'],
})
export class FicheRoleComponent {
  action!: string;
  role!: Role;
  role_id!: number;
  nom_role!: string;
  permissions!: string[];
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private globalService: GlobalService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    console.log(this.role);
    console.log(this.action);
  }

  //update role for BD
  updaterole() {
    const dialog = this.dialog.open(RoleFormComponent);
    dialog.componentInstance.role = this.role;
    dialog.componentInstance.action = 'edit';
    dialog.id = 'RoleFormComponent';
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.dialog.getDialogById('FicheRoleComponent')?.close(true);
      }
    });
  }

  //delete role for BD
  deleteRole() {
    const alert = this.dialog.open(AlertComponent);
    alert.componentInstance.content =
      'Voulez-vous supprimé le role ' + this.role.nom_role + ' ?';
    alert.componentInstance.backgroundColor = 'danger';
    alert.afterClosed().subscribe((confirmDelete) => {
      if (confirmDelete) {
        console.log(this.role);
        this.roleService.deleteRole(this.role).subscribe((data) => {
          console.log(data.message);
          this.dialog.closeAll();
          this.router.navigateByUrl('/role');
          this.globalService.toastShow(
            'Suppression effectuée',
            'Succès',
            'success'
          );
        });
      }
    });
  }
}
