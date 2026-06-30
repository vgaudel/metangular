import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ei01Carte } from './ei01-carte/ei01-carte';
import { Ei02Notes } from './ei02-notes/ei02-notes';
import { Ei03Contacts } from './ei03-contacts/ei03-contacts';
import { Ei04Cinema } from './ei04-cinema/ei04-cinema';
import { Ei05Alertes } from './ei05-alertes/ei05-alertes';
import { Ei06Couleur } from './ei06-couleur/ei06-couleur';
import { Ei07Reactions } from './ei07-reactions/ei07-reactions';
import { Ei08Formulaire } from './ei08-formulaire/ei08-formulaire';
import { Ei09Todos } from './ei09-todos/ei09-todos';
import { Ei10Boutique } from './ei10-boutique/ei10-boutique';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-exos-io',
  imports: [
    FormsModule,
    Ei01Carte, Ei02Notes, Ei03Contacts, Ei04Cinema, Ei05Alertes,
    Ei06Couleur, Ei07Reactions, Ei08Formulaire, Ei09Todos, Ei10Boutique,
  ],
  templateUrl: './exos-io.html',
  styleUrl: './exos-io.scss',
})
export class ExosIO {

  private _routeService = inject(ActivatedRoute)

  composants: string[] = [
    'ei01-carte',
    'ei02-notes',
    'ei03-contacts',
    'ei04-cinema',
    'ei05-alertes',
    'ei06-couleur',
    'ei07-reactions',
    'ei08-formulaire',
    'ei09-todos',
    'ei10-boutique'
  ];
  selectedComponent: string;
  isIndiceOutOfBounds : boolean = false;

  constructor(){
    
    let indice:number = this._routeService.snapshot.paramMap.get('numExo') ? Number(this._routeService.snapshot.paramMap.get('numExo')) : 1;
    this.isIndiceOutOfBounds= (indice-1<0) || (indice-1>this.composants.length-1);
    console.log("out of bounds ? " + Number(this._routeService.snapshot.paramMap.get('numExo')) + " " + this.isIndiceOutOfBounds);
    this.selectedComponent = this.composants[
      (this.isIndiceOutOfBounds)?0:indice-1];
    
  }
}
