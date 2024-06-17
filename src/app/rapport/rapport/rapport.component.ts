import { Component, ViewChild } from '@angular/core';
import { GetRole, Role } from 'src/app/Models/role.model';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RapportFicheComponent } from '../rapport-fiche/rapport-fiche.component';
import { RapportService } from 'src/app/Services/rapport.service';
import { GetRapport, Rapport } from 'src/app/Models/rapport.model';
import { RapportFormComponent } from '../rapport-form/rapport-form.component';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.scss']
})
export class RapportComponent {

  dataSource!: any
  isloadingpage!: boolean
  selectedRapportString!: string
  displayedColumns = [
    'type_rapport',
    'donnees',
    'genere_le',
    'nom_generateur',
    'Actions'
  ];
  constructor(
    private rapportService: RapportService,
    private dialog: MatDialog,
    private router: Router
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    this.getListRapports()
  }
  getListRapports(){
    this.isloadingpage = true
    const rapport: GetRapport = {
      rapport_id: 0,
    }
    this.rapportService.getList(rapport).subscribe(data => {
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

  createteRole(){
    const dialog = this.dialog.open(RapportFormComponent)
    dialog.componentInstance.action = 'create'
    dialog.id = 'RapportFormComponent'
    dialog.afterClosed().subscribe(result =>{
      if (result) {
        this.getListRapports()
      }
    })
  }


  actions(element: Rapport){
    this.selectedRapportString = JSON.stringify(element); 
    localStorage.setItem('selectedRapport', this.selectedRapportString);
    if (this.selectedRapportString) {
      this.router.navigateByUrl('rapport/view')
    }
  }
}
