import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-ex01-compteur',
  imports: [],
  templateUrl: './ex01-compteur.html',
  styleUrl: './ex01-compteur.scss',
})
export class Ex01Compteur {

  compteur = signal(0);

  incrementer() { this.compteur.update(v => v + 1); }
  decrementer() { this.compteur.update(v => Math.max(0, v - 1)); }
}
