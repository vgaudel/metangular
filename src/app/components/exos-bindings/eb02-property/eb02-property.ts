import { Component } from '@angular/core';

@Component({
  selector: 'app-eb02-property',
  imports: [],
  templateUrl: './eb02-property.html',
  styleUrl: './eb02-property.scss',
})
export class Eb02Property {
  imageUrl  = 'https://picsum.photos/200';
  lien      = 'https://angular.dev';
  desactive = true;

  toggle() {
    this.desactive = !this.desactive;
  }
}
