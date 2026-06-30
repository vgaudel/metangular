import { Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-ex07-computed-chaine',
  imports: [DecimalPipe],
  templateUrl: './ex07-computed-chaine.html',
  styleUrl: './ex07-computed-chaine.scss',
})
export class Ex07ComputedChaine {

  celsius = signal(20);

  fahrenheit = computed(() => this.celsius() * 9 / 5 + 32);

  description = computed(() => {
    const f = this.fahrenheit();
    if (f < 50)  return 'Froid ❄️';
    if (f <= 77) return 'Tiède 🌤️';
    return 'Chaud ☀️';
  });
}
