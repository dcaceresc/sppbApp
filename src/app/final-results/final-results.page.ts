import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refresh } from 'ionicons/icons';

@Component({
  selector: 'app-final-results',
  templateUrl: './final-results.page.html',
  styleUrls: ['./final-results.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class FinalResultsPage {
  sideBySideScore = signal(0);
  semiTandemScore = signal(0);
  tandemScore = signal(0);
  trail1Score = signal(0);
  trail2Score = signal(0);
  chairStandScore = signal(0);

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ refresh });

    this.route.queryParamMap.subscribe(params => {
      this.sideBySideScore.set(this.parseScore(params.get('sideBySideScore')));
      this.semiTandemScore.set(this.parseScore(params.get('semiTandemScore')));
      this.tandemScore.set(this.parseScore(params.get('tandemScore')));
      this.trail1Score.set(this.parseScore(params.get('trail1Score')));
      this.trail2Score.set(this.parseScore(params.get('trail2Score')));
      this.chairStandScore.set(this.parseScore(params.get('chairStandScore')));
    });
  }

  balanceSectionScore = computed(() => {
    return this.sideBySideScore() + this.semiTandemScore() + this.tandemScore();
  });

  speedSectionScore = computed(() => {
    return Math.max(this.trail1Score(), this.trail2Score());
  });

  finalTotalScore = computed(() => {
    return this.balanceSectionScore() + this.speedSectionScore() + this.chairStandScore();
  });

  reset() {
    this.sideBySideScore.set(0);
    this.semiTandemScore.set(0);
    this.tandemScore.set(0);
    this.trail1Score.set(0);
    this.trail2Score.set(0);
    this.chairStandScore.set(0);

    this.router.navigate(['/'], { replaceUrl: true });
  }

  private parseScore(value: string | null): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
