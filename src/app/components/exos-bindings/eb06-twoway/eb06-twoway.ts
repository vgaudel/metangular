import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eb06-twoway',
  imports: [FormsModule],
  templateUrl: './eb06-twoway.html',
  styleUrl: './eb06-twoway.scss',
})
export class Eb06Twoway {
  nom     = '';
  age     = 20;
  accepte = false;

  reset() {
    this.nom = '';
    this.age = 20;
    this.accepte = false;
  }
}
