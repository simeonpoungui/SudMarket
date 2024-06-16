import { Component } from '@angular/core';
import { Rapport } from 'src/app/Models/rapport.model';

@Component({
  selector: 'app-rapport-fiche',
  templateUrl: './rapport-fiche.component.html',
  styleUrls: ['./rapport-fiche.component.scss']
})
export class RapportFicheComponent {
  action!: string
  rapport!: Rapport
}
