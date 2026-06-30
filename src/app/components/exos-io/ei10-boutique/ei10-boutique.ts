import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IProduitSimple } from './IProduitSimple';
import { Ei10Produit } from './ei10-produit/ei10-produit';

@Component({
  selector: 'app-ei10-boutique',
  imports: [Ei10Produit, CurrencyPipe],
  templateUrl: './ei10-boutique.html',
  styleUrl: './ei10-boutique.scss',
})
export class Ei10Boutique {
  produits: IProduitSimple[] = [
    { nom: 'Clavier', prix: 89.99, stock: 5 },
    { nom: 'Souris', prix: 49.99, stock: 3 },
    { nom: 'Casque', prix: 129.99, stock: 0 },
    { nom: 'Webcam', prix: 79.99, stock: 2 },
  ];

  panier = signal<IProduitSimple[]>([]);

  total = computed(() => this.panier().reduce((sum, p) => sum + p.prix, 0));

  ajouterAuPanier(p: IProduitSimple) {
    p.stock--;
    this.panier.update(items => [...items, p]);
  }
}
