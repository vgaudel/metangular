import { Component } from '@angular/core';

@Component({
  selector: 'app-text-interpolation',
  imports: [],
  templateUrl: './text-interpolation.html',
  styleUrl: './text-interpolation.scss',
})
export class TextInterpolation {

  message: string = "Bonjour à tou.te.s";
  user = { name : "Gaudel", firstName: "Vincent", age: 40};

}
