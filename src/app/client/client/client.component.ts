import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent {

  dataSource!: any;
  displayedColumns = [
    'nom',
    'prenom',
    'email',
    'telephone',
    'sexe',
    'adresse',
    'nationalite',
    'Actions'
  ];

  isloadingpage!: boolean
  selectedClientstring: string = ''
  
  constructor(
    private router: Router,
    private clientService: ClientsService,
    private globalService: GlobalService,
    private dialog: MatDialog
  ){}
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListClient()
  }

  getListClient(){
    const client : GetClient = {client_id: 0}
    this.isloadingpage = true
    this.clientService.getListClient(client).subscribe(data => {
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

  create(){
    this.router.navigateByUrl('client/create')
  }

  actions(element: Client){
    console.log(element);
    this.selectedClientstring = JSON.stringify(element); 
    localStorage.setItem('selectedClient', this.selectedClientstring);
    if (this.selectedClientstring) {
      this.router.navigateByUrl('fiche/client/view')
    }
  }

}
