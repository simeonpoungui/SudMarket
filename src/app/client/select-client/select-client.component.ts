import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { AddClientModalComponent } from '../add-client-modal/add-client-modal.component';

@Component({
  selector: 'app-select-client',
  templateUrl: './select-client.component.html',
  styleUrls: ['./select-client.component.scss']
})
export class SelectClientComponent {

  dataSource!: any;
  displayedColumns = [
    'nom',
    'prenom',
    'email',
    'telephone',
    'sexe',
    'adresse',
    'nationalite',
  ];

  isloadingpage!: boolean
  selectedClientstring: string = ''
  clientSelected!: Client
  
  constructor(
    private router: Router,
    private dilog: MatDialog,
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
    const dialog = this.dialog.open(AddClientModalComponent)
    dialog.id = 'AddClientModalComponent'
    dialog.afterClosed().subscribe((result) => {
      if(result){
        this.getListClient()
      }
    })
  }

  onClickLine(client: Client){
    console.log(client.client_id);
    this.clientSelected = client;
    this.dialog.getDialogById('SelectClientComponent')?.close(true)
 }
}
