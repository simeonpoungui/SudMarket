import { Component, ViewChild } from '@angular/core';
import { RoleService } from 'src/app/Services/role.service';
import { GetRole, Role } from 'src/app/Models/role.model';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RoleFormComponent } from './role-form/role-form.component';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {
  dataSource!: any
  isloadingpage!: boolean
  displayedColumns = [
    'nom_role',
    'permissions',
    'Actions'
  ];
  constructor(
    private roleServicve: RoleService,
    private dialog: MatDialog
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    this.getListRoles()
  }
  getListRoles(){
    this.isloadingpage = true
    const role: GetRole = {
      role_id: 0,
    }
    this.roleServicve.getListRole(role).subscribe(data => {
      console.log(data);
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  actions(element: Role){
    const dialog = this.dialog.open(RoleFormComponent)
    dialog.componentInstance.role = element
  }

}
