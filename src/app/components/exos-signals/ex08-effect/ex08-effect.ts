import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ex08-effect',
  imports: [FormsModule],
  templateUrl: './ex08-effect.html',
  styleUrl: './ex08-effect.scss',
})
export class Ex08Effect {

  mot = signal('');
  mot2 = signal('');
  historique: string[] = [];

  isActive = signal(true);
  constructor() {
    effect(() => {
      const valeur = this.mot();
      if (valeur) this.historique.push(this.mot());
      //console.log(this.mot());
    });
     effect(() => {
      if(!this.isActive()) return;
      console.log(this.mot2());
    });
  }
}
