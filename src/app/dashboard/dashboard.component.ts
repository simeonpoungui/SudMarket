import { Component } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { PointsDeVentesComponent } from '../settings/points-de-ventes/points-de-ventes.component';
import { PointsDeVentes } from '../Models/pointsDeVentes.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  pointSelected!: PointsDeVentes;
  pointStorage!: any
  constructor(
    private loginService: LoginService, 
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedPointSelected = localStorage.getItem('pointSelected');
    if (storedPointSelected) {
      this.pointSelected = JSON.parse(storedPointSelected);
      console.log(this.pointSelected);
    }  }

  onLogout() {
    this.loginService.logout();
  }

  openPointsDeVentes() {
    const dialog = this.dialog.open(PointsDeVentesComponent);
    dialog.afterClosed().subscribe((result) => {
      this.pointSelected = dialog.componentInstance.pointSelected;
      console.log(this.pointSelected);
      localStorage.setItem('pointSelected', JSON.stringify(this.pointSelected));
      this.router.navigateByUrl('/session-vente')
    });
  }
}
