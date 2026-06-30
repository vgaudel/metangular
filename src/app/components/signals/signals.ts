import { Component, computed, effect, linkedSignal, signal, untracked, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-signals',
  imports: [],
  templateUrl: './signals.html',
  styleUrl: './signals.scss',
})
export class Signals {

  count1: number = 10;
  count2: WritableSignal<number> = signal(10);

  prixHT = signal(100);
  tva = signal(20)

  prixTTC = computed(() => this.prixHT() * (1+this.tva()/100));

  constructor() {
    setTimeout(() => this.count1 = 30, 5000);
    setTimeout(() => this.count2.set(50), 5000);
    setTimeout(() => this.tva.set(5), 3000);
    setTimeout(()=> this.changerChoix('Standard'),5000);

    effect(() => {
      const scoreActuel = this.score();
      const niveauActuel = untracked(() => this.niveau());
      console.log(`Score=${scoreActuel} (au niveau ${niveauActuel})`);
      })
  }

  log(): void {
    console.log("click");

  }

  // 1) .update() : modifier un signal à partir de sa valeur précédente
  compteur = signal(0);

  incrementer() {
    this.compteur.update(valeur => valeur + 1);
  }

  decrementer() {
    this.compteur.update(valeur => valeur - 1);
  }


  // 2) Signal de type tableau : mise à jour immuable avec .update()
  paniers = signal<string[]>(['Pomme', 'Banane']);

  ajouterFruit(fruit: string) {
    this.paniers.update(liste => [...liste, fruit]);
  }

 // 3) untracked() : lire un signal SANS s'y abonner
  //
  //    Scénario : on suit la partie d'un joueur.
  //    - 'score'  : à chaque fois qu'il change, on veut écrire une ligne de log.
  //    - 'niveau' : on veut juste CONNAITRE le niveau au moment du log,
  //                 mais on ne veut PAS écrire une nouvelle ligne quand SEUL
  //                 le niveau change.
  //
  //    Normalement, lire un signal dans un effect crée une dépendance :
  //    l'effect se relance dès que ce signal change.
  //    untracked() permet de LIRE la valeur sans créer cette dépendance.
  score = signal(0);
  niveau = signal(1);
  gagnerPoints() {
    this.score.update(s => s + 10);
  }

  monterNiveau() {
    this.niveau.update(n => n + 1);
  }


  // 4) linkedSignal() : signal dérivé mais qui reste modifiable
  //    Il se réinitialise quand sa source change, mais on peut le surcharger.
  options = signal<string[]>(['Standard', 'Express', 'Prioritaire']);
  choix = linkedSignal(() => this.options()[0]);

  changerChoix(option: string) {
    this.choix.set(option);
  }

}
