import { Component } from '@angular/core';
import { Rapport } from 'src/app/Models/rapport.model';

@Component({
  selector: 'app-rapport-form',
  templateUrl: './rapport-form.component.html',
  styleUrls: ['./rapport-form.component.scss']
})
export class RapportFormComponent {
 action!: string
 rapport!: Rapport
}
