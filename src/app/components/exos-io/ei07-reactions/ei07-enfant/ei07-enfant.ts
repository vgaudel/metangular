import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ei07-enfant',
  imports: [],
  templateUrl: './ei07-enfant.html',
  styleUrl: './ei07-enfant.scss',
})
export class Ei07Enfant {
  article  = input.required<string>();
  reaction = output<'like' | 'dislike'>();
}
