import { Component, signal } from '@angular/core';
import { Ei08Enfant } from './ei08-enfant/ei08-enfant';

@Component({
  selector: 'app-ei08-formulaire',
  imports: [Ei08Enfant],
  templateUrl: './ei08-formulaire.html',
  styleUrl: './ei08-formulaire.scss',
})
export class Ei08Formulaire {
  prenom = signal('');
  ville  = signal('');
  metier = signal('');
}
