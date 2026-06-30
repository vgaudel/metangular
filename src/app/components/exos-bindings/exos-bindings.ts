import { Component, inject } from '@angular/core';
import { Eb01Interpolation } from './eb01-interpolation/eb01-interpolation';
import { Eb02Property } from './eb02-property/eb02-property';
import { Eb03Classes } from './eb03-classes/eb03-classes';
import { FormsModule } from '@angular/forms';
import { Eb04Styles } from './eb04-styles/eb04-styles';
import { Eb05Events } from './eb05-events/eb05-events';
import { Eb06Twoway } from './eb06-twoway/eb06-twoway';
import { Eb07If } from './eb07-if/eb07-if';
import { Eb08For } from './eb08-for/eb08-for';
import { Eb09Switch } from './eb09-switch/eb09-switch';
import { Eb10Combine } from "./eb10-combine/eb10-combine";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exos-bindings',
  imports: [FormsModule, Eb01Interpolation, Eb02Property, Eb03Classes, Eb04Styles, Eb05Events, Eb06Twoway, Eb07If, Eb08For, Eb09Switch, Eb10Combine],
  templateUrl: './exos-bindings.html',
  styleUrl: './exos-bindings.scss',
})
export class ExosBindings {

  private _routeService = inject(ActivatedRoute);

  sousComposants: string[] = [
    'eb01-interpolation',
    'eb02-property',
    'eb03-classes',
    'eb04-styles',
    'eb05-events',
    'eb06-twoway',
    'eb07-if',
    'eb08-for',
    'eb09-switch',
    'eb10-combine',
  ]

  selectedSousComposant: string; //= this.sousComposants[this.sousComposants.length-1];
  isIndiceOutOfBounds: boolean;

  constructor(){

    let indiceString=this._routeService.snapshot.paramMap.get("numExo");
    let indiceNumber : number = indiceString ? Number(indiceString) : 0;

    this.isIndiceOutOfBounds = (indiceNumber-1 < 0 || indiceNumber-1>this.sousComposants.length-1);

    this.selectedSousComposant = this.sousComposants[(this.isIndiceOutOfBounds)?0:indiceNumber-1];

  }

}
