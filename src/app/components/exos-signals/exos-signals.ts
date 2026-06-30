import { Component } from '@angular/core';
import { Ex01Compteur } from './ex01-compteur/ex01-compteur';
import { Ex02SignalTexte } from './ex02-signal-texte/ex02-signal-texte';
import { Ex03Surface } from './ex03-surface/ex03-surface';
import { Ex04Toggle } from './ex04-toggle/ex04-toggle';
import { Ex05Notes } from './ex05-notes/ex05-notes';
import { Ex10Filtre } from './ex10-filtre/ex10-filtre';
import { Ex09Panier } from './ex09-panier/ex09-panier';
import { Ex08Effect } from './ex08-effect/ex08-effect';
import { Ex07ComputedChaine } from './ex07-computed-chaine/ex07-computed-chaine';
import { Ex06Todo } from './ex06-todo/ex06-todo';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exos-signals',
  imports: [FormsModule,Ex01Compteur, Ex02SignalTexte, Ex03Surface, Ex04Toggle, Ex05Notes,
    Ex06Todo, Ex07ComputedChaine, Ex08Effect, Ex09Panier, Ex10Filtre],
  templateUrl: './exos-signals.html',
  styleUrl: './exos-signals.scss',
})
export class ExosSignals {

  composants: string[] = [
    'ex01-compteur',
    'ex02-signal-texte',
    'ex03-surface',
    'ex04-toggle',
    'ex05-notes',
    'ex06-todo',
    'ex07-computed-chaine',
    'ex08-effect',
    'ex09-panier',
    'ex10-filtre'];
  selectedComponent: string = this.composants[0];
}
