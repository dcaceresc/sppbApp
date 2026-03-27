import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refresh } from 'ionicons/icons';
import { SideBySideComponent } from './side-by-side/side-by-side.component';
import { SemiTandemComponent } from './semi-tandem/semi-tandem.component';
import { TandemComponent } from './tandem/tandem.component';

@Component({
  selector: 'app-balance-test',
  templateUrl: './balance-test.page.html',
  styleUrls: ['./balance-test.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonList, IonItem, IonLabel,
    SideBySideComponent, SemiTandemComponent, TandemComponent
  ]
})
export class BalanceTestPage {

  currentStep = 'side-by-side';
  sideBySideScore: number | null = null;
  semiTandemScore: number | null = null;
  tandemScore: number | null = null;

  get sectionScore(): number {
    return (this.sideBySideScore ?? 0) + (this.semiTandemScore ?? 0) + (this.tandemScore ?? 0);
  }

  constructor(private router: Router) {
    addIcons({ refresh });
  }

  goToSemiTandem(score: number) {
    this.sideBySideScore = score;
    this.currentStep = 'semi-tandem';
  }

  goToTandem(score: number) {
    this.semiTandemScore = score;
    this.currentStep = 'tandem';
  }

  saveTandemResult(score: number) {
    this.tandemScore = score;
    this.goToSpeedTest();
  }

  goToSpeedTest() {
    this.router.navigate(['/speed-test'], {
      queryParams: {
        sideBySideScore: this.sideBySideScore ?? 0,
        semiTandemScore: this.semiTandemScore ?? 0,
        tandemScore: this.tandemScore ?? 0,
        balanceScore: this.sectionScore
      }
    });
  }

  restart() {
    this.currentStep = 'side-by-side';
    this.sideBySideScore = null;
    this.semiTandemScore = null;
    this.tandemScore = null;
  }
}
