import { Component } from '@angular/core';
import { EnfantExemple } from '../enfant-exemple/enfant-exemple';

@Component({
  selector: 'app-parent-exemple',
  imports: [EnfantExemple],
  templateUrl: './parent-exemple.html',
  styleUrl: './parent-exemple.scss',
})
export class ParentExemple {

  cpt = 0;

  updateCpt(op : string){
    if (op==='+') {this.cpt++;}
    else if (op ==='-') {this.cpt--;}
    else {console.log("Opérateur non reconnu");}
  }

}
