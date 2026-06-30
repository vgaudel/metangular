import { Component, output } from '@angular/core';

@Component({
  selector: 'app-enfant-exemple',
  imports: [],
  templateUrl: './enfant-exemple.html',
  styleUrl: './enfant-exemple.scss',
})
export class EnfantExemple {

  modification = output<string>();

  incrementer() {this.modification.emit('+');}
  decrementer() {this.modification.emit('-');}

  constructor(){
    
    setTimeout(()=>this.incrementer(),1000);
    setTimeout(()=>this.incrementer(),2000);
    setTimeout(()=>this.incrementer(),3000);    
    setTimeout(()=>this.incrementer(),4000);
    setTimeout(()=>this.incrementer(),5000);
    setTimeout(()=>this.incrementer(),6000);
  }
}
