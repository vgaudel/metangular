import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ITache {
  id: number;
  libelle: string;
}

@Component({
  selector: 'app-eb08-for',
  imports: [FormsModule],
  templateUrl: './eb08-for.html',
  styleUrl: './eb08-for.scss',
})
export class Eb08For {
  taches: ITache[] = [
    { id: 1, libelle: 'Apprendre @if' },
    { id: 2, libelle: 'Apprendre @for' },
    { id: 3, libelle: 'Apprendre @switch' },
  ];

  nouvelle = '';
  private nextId = 4;

  ajouter() {
    const lib = this.nouvelle.trim();
    if (!lib) return;
    this.taches = [...this.taches, { id: this.nextId++, libelle: lib }];
    this.nouvelle = '';
  }

  supprimer(id: number) {
    this.taches = this.taches.filter(t => t.id !== id);
  }
}
