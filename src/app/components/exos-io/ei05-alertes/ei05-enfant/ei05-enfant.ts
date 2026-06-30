import { Component, output } from '@angular/core';

@Component({
  selector: 'app-ei05-enfant',
  imports: [],
  templateUrl: './ei05-enfant.html',
  styleUrl: './ei05-enfant.scss',
})
export class Ei05Enfant {
  alerte = output<void>();
  declencherAlerte() { this.alerte.emit(); }
}
