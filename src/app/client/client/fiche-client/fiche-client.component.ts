import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utilisateur } from 'src/app/Models/users.model';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/Services/users.service';
import { GlobalService } from 'src/app/Services/global.service';
import { Client } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';

@Component({
  selector: 'app-fiche-client',
  templateUrl: './fiche-client.component.html',
  styleUrls: ['./fiche-client.component.scss']
})
export class FicheClientComponent {

  @Input() action!:string;
  client!: Client;
  message!: any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private dialog: MatDialog,
    private clientService: ClientsService
  ){}

  ngOnInit(): void {
    this.action = this.route.snapshot.params['action']
    console.log(this.action);
    const clientJSON = localStorage.getItem('selectedClient');
    if (clientJSON) {
      this.client =  JSON.parse(clientJSON);
    }
  }
  updateClient(){
    this.router.navigateByUrl('/client/edit')
  }
  //delete user for BD
  deleteClient(){
    const alert = this.dialog.open(AlertComponent)
    alert.componentInstance.content = "Voulez-vous supprimé le client " + this.client.nom + ' ?'
    alert.componentInstance.backgroundColor = "danger"
    alert.afterClosed().subscribe(confirmDelete => {
      if (confirmDelete) {
        console.log(this.client);
        this.clientService.deleteClient(this.client).subscribe(data => {
          console.log(data.message);
          this.message = data.message
          this.router.navigateByUrl('/client/list')
          this.globalService.toastShow(this.message,'Succès','success')
        } )
      }
      
    })
  }
}
