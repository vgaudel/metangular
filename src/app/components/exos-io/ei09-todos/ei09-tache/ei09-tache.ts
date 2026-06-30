import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ei09-tache',
  imports: [],
  templateUrl: './ei09-tache.html',
  styleUrl: './ei09-tache.scss',
})
export class Ei09Tache {
  tache    = input.required<string>();
  supprime = output<string>();
}
