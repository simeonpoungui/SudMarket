import { Component, ViewChild } from '@angular/core';
import { GetRole, Role } from 'src/app/Models/role.model';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RapportService } from 'src/app/Services/rapport.service';
import { GetRapport, Rapport } from 'src/app/Models/rapport.model';
import { CaissesService } from 'src/app/Services/caisses.service';
import { GetCaisseVendeur } from 'src/app/Models/caissevendeur.model';
import { CaisseVendeur } from 'src/app/Models/historiqueCaisseVendeur.model';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-historique-des-caisses-vendeur',
  templateUrl: './historique-des-caisses-vendeur.component.html',
  styleUrls: ['./historique-des-caisses-vendeur.component.scss'],
})
export class HistoriqueDesCaissesVendeurComponent {
  dataSource!: any;
  isloadingpage!: boolean;
  selectedRapportString!: string;
  displayedColumns = [
    'utilisateur_id',
    'montant_debit',
    'montant_credit',
    'date_comptable',
    'description',
    'montant'
  ];

  DateDebut!: string;
  DateFin!: string;
  caisse_vendeur_id!: number;
  tbcaisse!: CaisseVendeur[];

  constructor(
    public globalService: GlobalService,
    private dialog: MatDialog,
    private caisseSerices: CaissesService,
    private router: Router
  ) {}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getListCaissesVendeur();
  }
  getListCaissesVendeur() {
    const caisse: GetCaisseVendeur = {
      caisse_vendeur_id: 0,
    };
    this.caisseSerices.getListCaisseVendeur(caisse).subscribe((data) => {
      console.log(data.message);
      this.tbcaisse = data.message;
    });
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  actions(element: Rapport) {
    this.selectedRapportString = JSON.stringify(element);
    localStorage.setItem('selectedRapport', this.selectedRapportString);
    if (this.selectedRapportString) {
      this.router.navigateByUrl('rapport/view');
    }
  }

  selectCaisse(event: any) {
    console.log(event.target.value);
    this.caisse_vendeur_id = Number(event.target.value)
    this.getHistorique()
  }

  selectDateDebut(event: any) {
    this.DateDebut = event.target.value;
    console.log(this.DateDebut);
    this.getHistorique()
  }

  selectDateFin(event: any) {
    this.DateFin = event.target.value;
    this.getHistorique()
  }

  getHistorique() {
    this.caisseSerices
      .getHistoriqueCaisseVendeurByPlageDate(
        this.caisse_vendeur_id,
        this.DateDebut,
        this.DateFin
      )
      .subscribe((data) => {
        console.log(data.message);
        if (typeof data.message === 'string') {
          this.dataSource = new MatTableDataSource([])
          this.globalService.toastShow(data.message,'Information','info')
        }else {
          this.dataSource = new MatTableDataSource(data.message);
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
}
