import { Component } from '@angular/core';

@Component({
  selector: 'app-eb03-classes',
  imports: [],
  templateUrl: './eb03-classes.html',
  styleUrl: './eb03-classes.scss',
})
export class Eb03Classes {
  actif = false;
  theme: 'clair' | 'sombre' = 'clair';

  toggleActif() {
    this.actif = !this.actif;
  }
  inverserTheme() {
    this.theme = this.theme === 'clair' ? 'sombre' : 'clair';
  }
}
