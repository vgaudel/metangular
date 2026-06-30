import { Component, signal } from '@angular/core';
import { Ei06Enfant } from './ei06-enfant/ei06-enfant';

@Component({
  selector: 'app-ei06-couleur',
  imports: [Ei06Enfant],
  templateUrl: './ei06-couleur.html',
  styleUrl: './ei06-couleur.scss',
})
export class Ei06Couleur {
  couleur = signal('gray');
}
