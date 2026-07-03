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


  // Génère un nouvel id basé sur le max existant
  private generateId(): string {
    const maxId = this.products.reduce((max, p) => Math.max(max, Number(p.id)), 0);
    return String(maxId + 1);
  }


  getAllProducts(): IProduct[]{
    return [...this.products];
  }

  getProductById(id: string): IProduct {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error(`Produit introuvable (id: ${id})`);
    }
    return { ...product };
  }

  getProductByName(name: string): IProduct {
    const product = this.products.find(p => p.name === name);
    if (!product) {
      throw new Error(`Produit introuvable (name: ${name})`);
    }
    return { ...product };
  }

  getProductsByCategory(category: string): IProduct[] {
    return this.products.filter(p => p.category === category).map(p => ({ ...p }));
  }

  getProductsCategories(): string[] {
    return [...new Set(this.products.map(p => p.category))];
  }

  productExists(name: string): boolean {
    return this.products.some(p => p.name === name);
  }

  countProducts(): number {
    return this.products.length;
  }

  createProduct(product: Omit<IProduct, 'id'>): IProduct {
    const newProduct: IProduct = { ...product, id: this.generateId() };
    this.products.push(newProduct);
    return { ...newProduct };
  }

  updateProduct(id: string, product: Omit<IProduct, 'id'>): IProduct {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Produit introuvable (id: ${id})`);
    }
    const updated: IProduct = { ...product, id };
    this.products[index] = updated;
    return { ...updated };
  }

  deleteProductById(id: string): { message: string } {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Produit introuvable (id: ${id})`);
    }
    this.products.splice(index, 1);
    return { message: `Produit ${id} supprimé avec succès` };
  }

  deleteProductByName(name: string): { message: string } {
    const index = this.products.findIndex(p => p.name === name);
    if (index === -1) {
      throw new Error(`Produit introuvable (name: ${name})`);
    }
    this.products.splice(index, 1);
    return { message: `Produit ${name} supprimé avec succès` };
  }

}
