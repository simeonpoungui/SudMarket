import { Component } from '@angular/core';
import { Role } from 'src/app/Models/role.model';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent {
 role!: Role
 role_id!: number;
 nom_role!: string;
 permissions!: string[];
 
 constructor(

 ){}

 ngOnInit(): void {
  console.log(this.role);
  
}
}
