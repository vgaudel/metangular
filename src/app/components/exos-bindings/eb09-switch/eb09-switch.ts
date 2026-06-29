import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Role = 'admin' | 'user' | 'guest' | 'autre';

@Component({
  selector: 'app-eb09-switch',
  imports: [FormsModule],
  templateUrl: './eb09-switch.html',
  styleUrl: './eb09-switch.scss',
})
export class Eb09Switch {
  role: Role = 'user';
}
