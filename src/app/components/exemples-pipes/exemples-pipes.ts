import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExclamationPipe } from '../../pipes/exclamation-pipe';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';

@Component({
  selector: 'app-exemples-pipes',
  imports: [CommonModule,ExclamationPipe, TimeAgoPipe],
  templateUrl: './exemples-pipes.html',
  styleUrl: './exemples-pipes.scss',
})
export class ExemplesPipes {


  // Pipes sur les chaînes de caractères
  nom = "John Legend BAGUETTE";

  // pipes sur les nombres
  prix = 1234.567;
  pourcentage = 0.8542;

  // pipes sur les dates
  maintenant = new Date();

  hier = new Date("2026-06-30T15:16:00") ;

  // Pipes sur les objets / JSON
  utilisateur = {
    prenom : 'Marie',
    nom : 'Curie',
    age : 66,
    prix_nobel : ['Physique','Chimie']
  }

}
