import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ex03-surface',
  imports: [FormsModule],
  templateUrl: './ex03-surface.html',
  styleUrl: './ex03-surface.scss',
})
export class Ex03Surface {

  largeur = signal(1);
  hauteur = signal(1);

  surface = computed(() => this.largeur() * this.hauteur());
}
