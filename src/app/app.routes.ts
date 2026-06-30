import { Routes } from '@angular/router';
import { Bindings } from './components/bindings/bindings';
import { Welcome } from './components/layout/welcome/welcome';
import { NotFound } from './components/layout/not-found/not-found';
import { ControlFlow } from './components/control-flow/control-flow';
import { ExosBindings } from './components/exos-bindings/exos-bindings';
import { ExosIO } from './components/exos-io/exos-io';
import { ExosSignals } from './components/exos-signals/exos-signals';
import { OutputVote } from './components/output-vote/output-vote';
import { ProductList } from './components/product-list/product-list';
import { Signals } from './components/signals/signals';
import { TextInterpolation } from './components/text-interpolation/text-interpolation';
import { ExemplesPipes } from './components/exemples-pipes/exemples-pipes';

export const routes: Routes = [
    { path : 'welcome', component : Welcome},
    { path : '', redirectTo : 'welcome', pathMatch : 'full' },
    { path : 'bindings', component : Bindings},
    { path : 'controlflow', component : ControlFlow},
    { path : 'exosbindings/:numExo', component : ExosBindings},
    { path : 'exosbindings', component : ExosBindings},
    { path : 'exosio', component : ExosIO},
    { path : 'exossignals', component : ExosSignals},
    { path : 'outputvote', component : OutputVote},
    { path : 'productlist', component : ProductList},
    { path : 'signals', component : Signals},
    { path : 'textinterpolation', component : TextInterpolation},
    { path : 'exemplespipes' , component : ExemplesPipes},
    { path : '**', component : NotFound},
];
