import { Component, input } from '@angular/core';
import { IContact } from '../IContact';

@Component({
  selector: 'app-ei03-enfant',
  imports: [],
  templateUrl: './ei03-enfant.html',
  styleUrl: './ei03-enfant.scss',
})
export class Ei03Enfant {
  contact = input.required<IContact>();
}
