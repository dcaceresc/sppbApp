import { Component, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { walk, refresh } from 'ionicons/icons';

@Component({
  selector: 'app-speed-test',
  templateUrl: './speed-test.page.html',
  styleUrls: ['./speed-test.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonList, IonItem, IonLabel
  ]
})
export class SpeedTestPage implements OnDestroy {

  time = signal(0);
  running = signal(false);
  unableToPerform = signal(false);
  currentTrail = signal<1 | 2>(1);
  secondTrailCompleted = signal(false);

  trail1Score = signal<number | null>(null);
  trail2Score = signal<number | null>(null);
  sideBySideScore = signal(0);
  semiTandemScore = signal(0);
  tandemScore = signal(0);
  balanceScore = signal(0);

  private intervalId: any;
  private startTime = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ walk, refresh });

    this.route.queryParamMap.subscribe(params => {
      const sideBySide = Number(params.get('sideBySideScore'));
      const semiTandem = Number(params.get('semiTandemScore'));
      const tandem = Number(params.get('tandemScore'));
      const balance = Number(params.get('balanceScore'));

      this.sideBySideScore.set(Number.isFinite(sideBySide) ? sideBySide : 0);
      this.semiTandemScore.set(Number.isFinite(semiTandem) ? semiTandem : 0);
      this.tandemScore.set(Number.isFinite(tandem) ? tandem : 0);

      const computedBalance = this.sideBySideScore() + this.semiTandemScore() + this.tandemScore();
      this.balanceScore.set(Number.isFinite(balance) ? balance : computedBalance);
    });
  }

  seconds = computed(() => Math.floor(this.time() / 1000));
  displayMilliseconds = computed(() => Math.floor((this.time() % 1000) / 100));

  speedSectionScore = computed(() => {
    return Math.max(this.trail1Score() ?? 0, this.trail2Score() ?? 0);
  });

  totalScore = computed(() => {
    return this.balanceScore() + this.speedSectionScore();
  });


  start() {
    if (this.secondTrailCompleted()) {
      return;
    }

    this.time.set(0);
    this.unableToPerform.set(false);
    this.running.set(true);
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      this.time.set(Date.now() - this.startTime);
    }, 30);
  }

  stop() {
    clearInterval(this.intervalId);
    this.running.set(false);
    this.unableToPerform.set(false);

    const currentScore = this.getScoreForTime(this.time());

    if (this.currentTrail() === 1) {
      this.trail1Score.set(currentScore);
      this.currentTrail.set(2);
      this.time.set(0);
      return;
    }

    this.trail2Score.set(currentScore);
    this.secondTrailCompleted.set(true);
  }

  markUnableToPerform() {
    clearInterval(this.intervalId);
    this.running.set(false);
    this.time.set(0);
    this.unableToPerform.set(true);

    if (this.currentTrail() === 1) {
      this.trail1Score.set(0);
      this.trail2Score.set(0);
    } else {
      this.trail2Score.set(0);
    }

    this.goToChairStandTest();
  }

  goToChairStandTest() {
    this.router.navigate(['/chair-stand-test'], {
      queryParams: {
        sideBySideScore: this.sideBySideScore(),
        semiTandemScore: this.semiTandemScore(),
        tandemScore: this.tandemScore(),
        trail1Score: this.trail1Score() ?? 0,
        trail2Score: this.trail2Score() ?? 0,
        balanceScore: this.balanceScore(),
        speedScore: this.speedSectionScore(),
        totalScore: this.totalScore()
      }
    });
  }

  reset() {
    clearInterval(this.intervalId);
    this.time.set(0);
    this.running.set(false);
    this.unableToPerform.set(false);
    this.currentTrail.set(1);
    this.secondTrailCompleted.set(false);

    this.trail1Score.set(null);
    this.trail2Score.set(null);

    this.sideBySideScore.set(0);
    this.semiTandemScore.set(0);
    this.tandemScore.set(0);
    this.balanceScore.set(0);

    this.router.navigate(['/']);
  }

  private getScoreForTime(timeMs: number): number {
    if (timeMs < 4820) return 4;
    if (timeMs <= 6200) return 3;
    if (timeMs <= 8700) return 2;
    return 1;
  }



  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
