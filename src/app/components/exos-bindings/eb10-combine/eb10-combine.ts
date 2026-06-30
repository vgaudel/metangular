import { Component } from '@angular/core';
import { IArticle } from '../../../model/IArticle';
import { FormsModule } from '@angular/forms';

type Filtre = 'tous' | 'legume' | 'fruit' | 'boisson';


@Component({
  selector: 'app-eb10-combine',
  imports: [FormsModule],
  templateUrl: './eb10-combine.html',
  styleUrl: './eb10-combine.scss',
})
export class Eb10Combine {

  articles: IArticle[] = [
    { id: 1, nom: 'Pomme', prix: 0.5, categorie: 'fruit', stock: 10 },
    { id: 2, nom: 'Banane', prix: 0.3, categorie: 'fruit', stock: 0 },
    { id: 3, nom: 'Carotte', prix: 0.8, categorie: 'legume', stock: 5 },
    { id: 4, nom: 'Salade', prix: 1.2, categorie: 'legume', stock: 0 },
    { id: 5, nom: "Jus d'orange", prix: 2.5, categorie: 'boisson', stock: 8 },
    { id: 6, nom: 'Eau gazeuse', prix: 1.0, categorie: 'boisson', stock: 20 },
  ];

  filtre : Filtre = 'tous';
  cacherRupture: boolean = true;

  acheter(id: number): void {
    const article = this.articles.find(a => a.id === id);
    if (article && article.stock>0) {
      article.stock--;
    }
  } 

  setFiltre(f : Filtre ): void{
    this.filtre = f;
  }

  get articleFiltres(): IArticle[]{
    return this.articles
    .filter(a => this.filtre === 'tous' || this.filtre === a.categorie)
    .filter(a => !this.cacherRupture || a.stock>0)
  }

}
