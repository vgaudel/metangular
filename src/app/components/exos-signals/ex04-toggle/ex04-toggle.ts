import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-ex04-toggle',
  imports: [],
  templateUrl: './ex04-toggle.html',
  styleUrl: './ex04-toggle.scss',
})
export class Ex04Toggle {

  estVisible = signal(true);

  basculer() { this.estVisible.update(v => !v); }
}
