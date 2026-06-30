import { Component, input } from '@angular/core';
import { IProduct } from '../../model/IProduct';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe,TitleCasePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

  // Le produit à afficher est fourni 
  // par le composant parent ProductList
  product = input.required<IProduct>()
}
