import { Component, inject, signal } from '@angular/core';
import { IProduct } from '../../model/IProduct';
import { ProductCard } from '../product-card/product-card';
import { MockProductService } from '../../services/mock-product-service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {

  productService: MockProductService = inject(MockProductService);

  //Récupération des produits depuis le service (tableau local)
  products = signal<IProduct[]>(this.productService.getAllProducts());

}
