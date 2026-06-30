import { Component, computed, signal } from '@angular/core';
import { OutputEnfant } from './output-enfant/output-enfant';

@Component({
  selector: 'app-output-vote',
  imports: [OutputEnfant],
  templateUrl: './output-vote.html',
  styleUrl: './output-vote.scss',
})
export class OutputVote {

  // Le parent comptabilise les votes reçus depuis l'enfant
  pour = signal(0);
  contre = signal(0);
  abstention = signal(0);

  total = computed(() => this.pour() + this.contre() + this.abstention())
 
  // méthode appelée lorsque l'enfant à voté
  onVoteRecu(choix: string){
    if (choix === 'pour') {
      this.pour.update((v) => v+1);
    } else  if (choix === 'contre') {
      this.contre.update((v) => v+1);
    } else {
      this.abstention.update((v) => v+1);
    }
  }

}
