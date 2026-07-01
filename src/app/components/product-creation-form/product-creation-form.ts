import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-creation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-creation-form.html',
  styleUrl: './product-creation-form.scss',
})
export class ProductCreationForm {

     // ────────────────────────────────────────────────────────────────────────────
  // FormGroup : regroupe plusieurs FormControl sous un objet unique.
  // Chaque FormControl accepte : (valeurInitiale, validateurSync, validateurAsync)
  //
  // Validators disponibles (built-in) :
  //   Validators.required          → le champ ne doit pas être vide
  //   Validators.requiredTrue      → la valeur doit être true (case à cocher)
  //   Validators.minLength(n)      → longueur minimale de n caractères
  //   Validators.maxLength(n)      → longueur maximale de n caractères
  //   Validators.min(n)            → valeur numérique minimale
  //   Validators.max(n)            → valeur numérique maximale
  //   Validators.email             → format email valide
  //   Validators.pattern(regex)    → correspond à une expression régulière
  //   Validators.nullValidator     → ne fait rien (placeholder utile)
  //   Validators.compose([...])    → combine plusieurs validateurs (équivalent à un tableau)
  //   Validators.composeAsync([...]) → idem pour les validateurs asynchrones
  // ────────────────────────────────────────────────────────────────────────────

form = new FormGroup(
  {
    // Pour notre utilisateur, on veut pouvoir saisir 5 attributs
    name : new FormControl('',[Validators.required,Validators.minLength(2)]),
    description : new FormControl('',[Validators.required]),
    price : new FormControl('',[Validators.required, Validators.min(0.01)]),
    category : new FormControl('',[Validators.required]),
    stock : new FormControl('',[Validators.required, Validators.min(0)]),
  }
)
  onSubmit(){
    console.log(this.form.value);
    
  }
}
