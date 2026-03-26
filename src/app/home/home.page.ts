import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { IonCard, IonCardContent, IonList, IonItem, IonLabel} from '@ionic/angular/standalone';
import { SideBySideComponent } from './side-by-side/side-by-side.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel,SideBySideComponent],
})
export class HomePage {
  constructor() {}
}
