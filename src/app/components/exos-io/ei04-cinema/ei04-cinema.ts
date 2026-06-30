import { Component } from '@angular/core';
import { IFilm } from './IFilm';
import { Ei04Carte } from './ei04-carte/ei04-carte';

@Component({
  selector: 'app-ei04-cinema',
  imports: [Ei04Carte],
  templateUrl: './ei04-cinema.html',
  styleUrl: './ei04-cinema.scss',
})
export class Ei04Cinema {
  films: IFilm[] = [
    { titre: 'Inception', realisateur: 'Christopher Nolan', annee: 2010, genre: 'SF' },
    { titre: 'Parasite', realisateur: 'Bong Joon-ho', annee: 2019, genre: 'Thriller' },
    { titre: 'The Matrix', realisateur: 'Wachowski', annee: 1999, genre: 'SF' },
    { titre: 'Interstellar', realisateur: 'Christopher Nolan', annee: 2014, genre: 'SF' },
  ];
}
