import { Component, signal } from '@angular/core';
import { Ei05Enfant } from './ei05-enfant/ei05-enfant';

@Component({
  selector: 'app-ei05-alertes',
  imports: [Ei05Enfant],
  templateUrl: './ei05-alertes.html',
  styleUrl: './ei05-alertes.scss',
})
export class Ei05Alertes {
  nbAlertes = signal(0);
}
