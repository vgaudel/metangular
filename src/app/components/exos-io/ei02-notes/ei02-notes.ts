import { Component } from '@angular/core';
import { Ei02Enfant } from './ei02-enfant/ei02-enfant';

@Component({
  selector: 'app-ei02-notes',
  imports: [Ei02Enfant],
  templateUrl: './ei02-notes.html',
  styleUrl: './ei02-notes.scss',
})
export class Ei02Notes {
  etudiants = [
    { prenom: 'Alice', note: 17 },
    { prenom: 'Bob', note: 11 },
    { prenom: 'Clara', note: 7 },
    { prenom: 'David', note: 14 },
  ];
}
