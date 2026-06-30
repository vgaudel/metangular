import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-ei02-enfant',
  imports: [],
  templateUrl: './ei02-enfant.html',
  styleUrl: './ei02-enfant.scss',
})
export class Ei02Enfant {
  note   = input.required<number>();
  prenom = input.required<string>();

  couleur = computed(() => {
    if (this.note() < 10) return 'red';
    if (this.note() < 14) return 'orange';
    return 'green';
  });
}
