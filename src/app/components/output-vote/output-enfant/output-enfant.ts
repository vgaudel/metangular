import { Component, output } from '@angular/core';

@Component({
  selector: 'app-output-enfant',
  imports: [],
  templateUrl: './output-enfant.html',
  styleUrl: './output-enfant.scss',
})
export class OutputEnfant {

  //output() Emet un évènement Vers le composant parent

  aVote=output<string>();

  voter(choix: string){
    // .emit() envoie la valeur choix au parent
    this.aVote.emit(choix);
  }

}
