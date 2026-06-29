import { Component } from '@angular/core';

@Component({
  selector: 'app-eb05-events',
  imports: [],
  templateUrl: './eb05-events.html',
  styleUrl: './eb05-events.scss',
})
export class Eb05Events {
  compteur = 0;
  dernierePosition = { x: 0, y: 0 };

  incrementer() {
    this.compteur++;
  }

  reset() {
    this.compteur = 0;
  }

  onMove(event: MouseEvent) {
    this.dernierePosition = { x: event.offsetX, y: event.offsetY };
  }
}
