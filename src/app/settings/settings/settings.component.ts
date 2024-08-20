import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SouceTransfertComponent } from 'src/app/comptabilite/transfert-caisse-exploitation/souce-transfert/souce-transfert.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(
    private dialog: MatDialog
  ){}

  chooseSource(){
  const dialog = this.dialog.open(SouceTransfertComponent)
  }
}
