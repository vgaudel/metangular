import { Component } from '@angular/core';

@Component({
  selector: 'app-eb01-interpolation',
  imports: [],
  templateUrl: './eb01-interpolation.html',
  styleUrl: './eb01-interpolation.scss', 
})
export class Eb01Interpolation {
  prenom = 'Alice';
  age    = 28;
  prixHT = 120;
  readonly tva = 0.20;

  get prixTTC(): number {
    return this.prixHT * (1 + this.tva);
  }
}
