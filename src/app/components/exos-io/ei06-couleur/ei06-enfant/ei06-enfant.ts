import { Component, output } from '@angular/core';

@Component({
  selector: 'app-ei06-enfant',
  imports: [],
  templateUrl: './ei06-enfant.html',
  styleUrl: './ei06-enfant.scss',
})
export class Ei06Enfant {
  couleurChoisie = output<string>();
  choisir(c: string) { this.couleurChoisie.emit(c); }
}
