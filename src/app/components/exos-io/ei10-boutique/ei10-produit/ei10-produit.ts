import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IProduitSimple } from '../IProduitSimple';

@Component({
  selector: 'app-ei10-produit',
  imports: [CurrencyPipe],
  templateUrl: './ei10-produit.html',
  styleUrl: './ei10-produit.scss',
})
export class Ei10Produit {
  produit        = input.required<IProduitSimple>();
  ajouteAuPanier = output<IProduitSimple>();
}
