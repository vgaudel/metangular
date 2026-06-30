import { Injectable } from '@angular/core';
import { IProduct } from '../model/IProduct';

@Injectable({
  providedIn: 'root',
})
export class MockProductService {

  // Tableau de valeurs en local (remplace les appels au backend)
  private products: IProduct[] = [
    { id: '1', name: 'Clavier mécanique', description: 'Clavier RGB switches rouges', price: 89.99, category: 'peripherique', stock: 25 },
    { id: '2', name: 'Souris sans fil', description: 'Souris ergonomique 16000 DPI', price: 49.99, category: 'peripherique', stock: 40 },
    { id: '3', name: 'Écran 27"', description: 'Moniteur 144Hz QHD', price: 299.99, category: 'ecran', stock: 12 },
    { id: '4', name: 'Casque audio', description: 'Casque sans fil réduction de bruit', price: 159.99, category: 'audio', stock: 0 },
    { id: '5', name: 'Webcam HD', description: 'Webcam 1080p 60fps', price: 79.99, category: 'peripherique', stock: 18 },
  ];

  getAllProducts(): IProduct[]{
    return [...this.products];
  }

}
