import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { TextInterpolation } from "./components/text-interpolation/text-interpolation";
import { Footer } from './components/layout/footer/footer';
import { Bindings } from './components/bindings/bindings';
import { ControlFlow } from "./components/control-flow/control-flow";
import { ExosBindings } from './components/exos-bindings/exos-bindings';
import { Signals } from './components/signals/signals';
import { ProductList } from './components/product-list/product-list';
import { OutputVote } from './components/output-vote/output-vote';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    Header, 
    Footer, 
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('metangular');
}
