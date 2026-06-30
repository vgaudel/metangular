import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-ei08-enfant',
  imports: [],
  templateUrl: './ei08-enfant.html',
  styleUrl: './ei08-enfant.scss',
})
export class Ei08Enfant {
  libelle     = input('Saisir une valeur');
  placeholder = input('');
  valide      = output<string>();
  valeur      = signal('');

  soumettre() {
    if (this.valeur().trim()) this.valide.emit(this.valeur().trim());
  }
}
