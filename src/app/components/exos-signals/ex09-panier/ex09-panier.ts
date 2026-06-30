import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-ex09-panier',
  imports: [CurrencyPipe],
  templateUrl: './ex09-panier.html',
  styleUrl: './ex09-panier.scss',
})
export class Ex09Panier {

  quantite     = signal(1);
  prixUnitaire = signal(29.99);

  sousTotal = computed(() => this.quantite() * this.prixUnitaire());
  tva       = computed(() => this.sousTotal() * 0.20);
  totalTTC  = computed(() => this.sousTotal() + this.tva());
}
