import { Component, signal } from '@angular/core';
import { Ei07Enfant } from './ei07-enfant/ei07-enfant';

@Component({
  selector: 'app-ei07-reactions',
  imports: [Ei07Enfant],
  templateUrl: './ei07-reactions.html',
  styleUrl: './ei07-reactions.scss',
})
export class Ei07Reactions {
  articles = ['Clavier mécanique', 'Souris ergonomique', 'Écran 4K'];
  likes    = signal(0);
  dislikes = signal(0);

  onReaction(r: 'like' | 'dislike') {
    if (r === 'like') this.likes.update(v => v + 1);
    else this.dislikes.update(v => v + 1);
  }
}
