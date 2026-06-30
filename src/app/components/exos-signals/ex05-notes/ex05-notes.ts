import { Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ex05-notes',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './ex05-notes.html',
  styleUrl: './ex05-notes.scss',
})
export class Ex05Notes {

  noteMath     = signal(10);
  noteFrancais = signal(10);
  noteHistoire = signal(10);

  moyenne = computed(() =>
    (this.noteMath() + this.noteFrancais() + this.noteHistoire()) / 3
  );

  mention = computed(() => {
    const m = this.moyenne();
    if (m < 10) return 'Insuffisant ❌';
    if (m < 12) return 'Passable 😐';
    if (m < 14) return 'Assez bien 🙂';
    if (m < 18) return 'Bien 👍';
    return 'Très bien ⭐';
  });
}
