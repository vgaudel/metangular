import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ex02-signal-texte',
  imports: [FormsModule],
  templateUrl: './ex02-signal-texte.html',
  styleUrl: './ex02-signal-texte.scss',
})
export class Ex02SignalTexte {

  prenom = signal('');

}
