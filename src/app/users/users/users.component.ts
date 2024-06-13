import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/Services/users.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { UsersFormComponent } from './users-form/users-form.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  dataSource!: any;
  displayedColumns = [
    'nom_utilisateur',
    'prenom_utilisateur',
    'email',
    'telephone',
    'sexe',
    'adresse',
    'nationalite',
    'role',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedUtilisateurString: string = ''
  
  constructor(
    private userService: UsersService,
    private router: Router,
    private dialog: MatDialog
  ){}


  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.getListUsers()
  }

  getListUsers(){
    const user : GetUser = {
      utilisateur_id: 0
    }
    this.isloadingpage = true
    this.userService.getListUser(user).subscribe(data => {
      console.log(data.message);
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }


  actions(element: Utilisateur){
    this.selectedUtilisateurString = JSON.stringify(element); 
    localStorage.setItem('selectedUtilisateur', this.selectedUtilisateurString);
    if (this.selectedUtilisateurString) {
      this.router.navigateByUrl('fiche/view')
    }
  }
}
