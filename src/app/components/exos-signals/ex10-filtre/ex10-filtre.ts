import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-ex10-filtre',
  imports: [],
  templateUrl: './ex10-filtre.html',
  styleUrl: './ex10-filtre.scss',
})
export class Ex10Filtre {

  recherche = signal('');
  produits  = signal(['Pomme', 'Poire', 'Fraise', 'Mangue', 'Pastèque', 'Papaye']);

  produitsFiltres = computed(() =>
    this.produits().filter(p =>
      p.toLowerCase().includes(this.recherche().toLowerCase())
    )
  );

  majRecherche(event: Event) {
    this.recherche.set((event.target as HTMLInputElement).value);
  }
}
