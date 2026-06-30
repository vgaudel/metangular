import { Component } from '@angular/core';
import { IContact } from './IContact';
import { Ei03Enfant } from './ei03-enfant/ei03-enfant';

@Component({
  selector: 'app-ei03-contacts',
  imports: [Ei03Enfant],
  templateUrl: './ei03-contacts.html',
  styleUrl: './ei03-contacts.scss',
})
export class Ei03Contacts {
  contacts: IContact[] = [
    { prenom: 'Marie', nom: 'Curie', email: 'marie@science.fr', ville: 'Paris' },
    { prenom: 'Albert', nom: 'Einstein', email: 'albert@physique.de', ville: 'Berne' },
    { prenom: 'Ada', nom: 'Lovelace', email: 'ada@code.uk', ville: 'Londres' },
  ];
}
