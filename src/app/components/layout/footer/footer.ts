import { Component, inject } from '@angular/core';
import { PreferenceService } from '../../../services/preference-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [FormsModule,CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

  private _preferenceService = inject(PreferenceService);

   get preferenceService(){
    return this._preferenceService;
   }

   constructor(){
    //this._preferenceService.couleurPreferee='#333';
   }

}
