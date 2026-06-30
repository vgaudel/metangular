import { Component, input } from '@angular/core';
import { IFilm } from '../IFilm';

@Component({
  selector: 'app-ei04-carte',
  imports: [],
  templateUrl: './ei04-carte.html',
  styleUrl: './ei04-carte.scss',
})
export class Ei04Carte {
  film = input.required<IFilm>();
}
