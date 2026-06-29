import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bindings',
  imports: [FormsModule],
  templateUrl: './bindings.html',
  styleUrl: './bindings.scss',
})
export class Bindings {
  // Interpolation
  title : string = "Démonstration des bindings Angular";
  user = {firstname: 'Ada', lastName: 'Lovelace'};
  // binding de propriété
  imageUrl: string = "/beard.svg";
  isButtonDisabled: boolean = true;
  //binding d'attribut
  colspanValue: number = 2;
  //Class binding
  isActive: boolean = true;
  // Style binding
  textColor: string = 'crimson';
  fontSize: number = 18;
  //Event Binding
  clickCount: number = 0;
  // two-way binding
  username: string ="";

  incrementCounter(): void{
    this.clickCount++;
  }
  toggleButton(): void {
    this.isButtonDisabled = !this.isButtonDisabled;
  }
  onKeyUp(value: string): void {
    this.username = value;
  }
}
