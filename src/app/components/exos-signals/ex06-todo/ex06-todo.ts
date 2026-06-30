import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ex06-todo',
  imports: [FormsModule],
  templateUrl: './ex06-todo.html',
  styleUrl: './ex06-todo.scss',
})
export class Ex06Todo {

  taches = signal<string[]>([]);
  nouvelleTache = signal('');
  nbTaches = computed(() => this.taches().length);

  ajouter() {
    if (!this.nouvelleTache().trim()) return;
    this.taches.update(t => [...t, this.nouvelleTache().trim()]);
    this.nouvelleTache.set('');
  }
}
