import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { PointsDeVentes } from 'src/app/Models/pointsDeVentes.model';
import { PointsDeVentesService } from 'src/app/Services/points-de-ventes.service';

@Component({
  selector: 'app-fiche-point-de-vente',
  templateUrl: './fiche-point-de-vente.component.html',
  styleUrls: ['./fiche-point-de-vente.component.scss']
})
export class FichePointDeVenteComponent {
  action: string = 'view';
  message!: any
  point!: PointsDeVentes
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private pointService: PointsDeVentesService
  ){}

  ngOnInit(): void {
    console.log(this.action);
    const pointtJSON = localStorage.getItem('selectedPointVente');
    if (pointtJSON) {
      this.point =  JSON.parse(pointtJSON);
      console.log(this.point);
    }
  }
  updatepoint(){
    this.router.navigateByUrl('/point/vente/edit')
  }
  //delete user for BD
  deletepoint(){
    const alert = this.dialog.open(AlertComponent)
    alert.componentInstance.content = "Voulez-vous supprimé le client " + this.point.nom + ' ?'
    alert.componentInstance.backgroundColor = "danger"
    alert.afterClosed().subscribe(confirmDelete => {
      if (confirmDelete) {
        console.log(this.point);
        this.pointService.delete(this.point).subscribe(data => {
          console.log(data.message);
          this.message = data.message
          this.router.navigateByUrl('/point/list')
          this.globalService.toastShow(this.message,'Succès','success')
        } )
      }
      
    })
  }
}
