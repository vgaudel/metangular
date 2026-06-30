import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ei01-enfant',
  imports: [],
  templateUrl: './ei01-enfant.html',
  styleUrl: './ei01-enfant.scss',
})
export class Ei01Enfant {
  nom   = input('Inconnu');
  poste = input('Collaborateur');
}
