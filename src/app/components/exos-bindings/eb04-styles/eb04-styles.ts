import { Component } from '@angular/core';

@Component({
  selector: 'app-eb04-styles',
  imports: [],
  templateUrl: './eb04-styles.html',
  styleUrl: './eb04-styles.scss',
})
export class Eb04Styles {
  taille  = 16;
  couleur = '#3366ff';

  onTaille(event: Event) {
    this.taille = (event.target as HTMLInputElement).valueAsNumber;
  }

  onCouleur(event: Event) {
    this.couleur = (event.target as HTMLInputElement).value;
  }
}
