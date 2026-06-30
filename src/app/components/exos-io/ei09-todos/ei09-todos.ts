import { Component, signal } from '@angular/core';
import { Ei09Tache } from './ei09-tache/ei09-tache';

@Component({
  selector: 'app-ei09-todos',
  imports: [Ei09Tache],
  templateUrl: './ei09-todos.html',
  styleUrl: './ei09-todos.scss',
})
export class Ei09Todos {
  taches = signal<string[]>(['Faire les courses', 'Appeler le medecin', 'Lire Angular docs']);

  onSupprime(nom: string) {
    this.taches.update(t => t.filter(x => x !== nom));
  }
}
