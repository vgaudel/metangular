import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { TextInterpolation } from "./components/text-interpolation/text-interpolation";
import { Footer } from './components/footer/footer';
import { Bindings } from './components/bindings/bindings';
import { ControlFlow } from "./components/control-flow/control-flow";
import { ExosBindings } from './components/exos-bindings/exos-bindings';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, TextInterpolation, Footer, Bindings, ControlFlow, ExosBindings],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('metangular');
}
