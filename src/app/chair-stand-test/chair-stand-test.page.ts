import { Component, OnDestroy, computed, signal } from '@angular/core';
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
  IonBadge,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refresh, body, moon, sunny } from 'ionicons/icons';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-chair-stand-test',
  templateUrl: './chair-stand-test.page.html',
  styleUrls: ['./chair-stand-test.page.scss'],
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
    IonBadge,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class ChairStandTestPage implements OnDestroy {
  time = signal(0);
  running = signal(false);
  finished = signal(false);
  unableToPerform = signal(false);

  sideBySideScore = signal(0);
  semiTandemScore = signal(0);
  tandemScore = signal(0);
  trail1Score = signal(0);
  trail2Score = signal(0);
  trail1MetersPerSecond = signal(0);
  trail2MetersPerSecond = signal(0);
  balanceScore = signal(0);
  speedScore = signal(0);
  previousTotalScore = signal(0);

  private intervalId: any;
  private startTime = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public theme: ThemeService
  ) {
    addIcons({ refresh, body, moon, sunny });

    this.route.queryParamMap.subscribe(params => {
      this.resetInternalState();

      const sideBySide = Number(params.get('sideBySideScore'));
      const semiTandem = Number(params.get('semiTandemScore'));
      const tandem = Number(params.get('tandemScore'));
      const trail1 = Number(params.get('trail1Score'));
      const trail2 = Number(params.get('trail2Score'));
      const balance = Number(params.get('balanceScore'));
      const speed = Number(params.get('speedScore'));
      const total = Number(params.get('totalScore'));

      this.sideBySideScore.set(Number.isFinite(sideBySide) ? sideBySide : 0);
      this.semiTandemScore.set(Number.isFinite(semiTandem) ? semiTandem : 0);
      this.tandemScore.set(Number.isFinite(tandem) ? tandem : 0);
      this.trail1Score.set(Number.isFinite(trail1) ? trail1 : 0);
      this.trail2Score.set(Number.isFinite(trail2) ? trail2 : 0);

      const t1ms = Number(params.get('trail1MetersPerSecond'));
      const t2ms = Number(params.get('trail2MetersPerSecond'));
      this.trail1MetersPerSecond.set(Number.isFinite(t1ms) ? t1ms : 0);
      this.trail2MetersPerSecond.set(Number.isFinite(t2ms) ? t2ms : 0);

      const computedBalance = this.sideBySideScore() + this.semiTandemScore() + this.tandemScore();
      const computedSpeed = this.trail1Score() + this.trail2Score();

      this.balanceScore.set(Number.isFinite(balance) ? balance : computedBalance);
      this.speedScore.set(Number.isFinite(speed) ? speed : computedSpeed);
      this.previousTotalScore.set(Number.isFinite(total) ? total : this.balanceScore() + this.speedScore());
    });
  }

  balanceSectionScore = computed(() => {
    return this.sideBySideScore() + this.semiTandemScore() + this.tandemScore();
  });

  speedSectionScore = computed(() => {
    return this.trail1Score() + this.trail2Score();
  });

  seconds = computed(() => Math.floor(this.time() / 1000));
  centiseconds = computed(() => Math.floor((this.time() % 1000) / 10));
  displayCentiseconds = computed(() => this.centiseconds().toString().padStart(2, '0'));

  chairStandScore = computed(() => {
    if (!this.finished()) return null;
    if (this.unableToPerform()) return 0;
    return this.getScoreForTime(this.time());
  });

  finalTotalScore = computed(() => {
    return this.previousTotalScore() + (this.chairStandScore() ?? 0);
  });

  scoreLabel = computed(() => {
    const score = this.chairStandScore();
    if (score === null) return '';
    if (score === 4) return '< 11.19 s';
    if (score === 3) return '11.20 - 13.69 s';
    if (score === 2) return '13.70 - 16.69 s';
    if (score === 1) return '16.70 - 59.99 s';
    return '> 60 s o no puede';
  });

  scoreColor = computed(() => {
    const score = this.chairStandScore();
    if (score === 4) return 'success';
    if (score === 3) return 'primary';
    if (score === 2) return 'warning';
    if (score === 1) return 'danger';
    if (score === 0) return 'medium';
    return 'medium';
  });

  start() {
    this.time.set(0);
    this.finished.set(false);
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
    this.finished.set(true);
    this.unableToPerform.set(false);
    this.goToFinalResults(this.getScoreForTime(this.time()));
  }

  markUnableToPerform() {
    clearInterval(this.intervalId);
    this.running.set(false);
    this.time.set(0);
    this.finished.set(true);
    this.unableToPerform.set(true);
    this.goToFinalResults(0);
  }

  goToFinalResults(chairStandScore: number) {
    this.router.navigate(['/final-results'], {
      queryParams: {
        sideBySideScore: this.sideBySideScore(),
        semiTandemScore: this.semiTandemScore(),
        tandemScore: this.tandemScore(),
        trail1Score: this.trail1Score(),
        trail2Score: this.trail2Score(),
        trail1MetersPerSecond: this.trail1MetersPerSecond(),
        trail2MetersPerSecond: this.trail2MetersPerSecond(),
        chairStandScore
      }
    });
  }

  reset() {
    this.resetInternalState();

    this.sideBySideScore.set(0);
    this.semiTandemScore.set(0);
    this.tandemScore.set(0);
    this.trail1Score.set(0);
    this.trail2Score.set(0);
    this.trail1MetersPerSecond.set(0);
    this.trail2MetersPerSecond.set(0);
    this.balanceScore.set(0);
    this.speedScore.set(0);
    this.previousTotalScore.set(0);

    this.router.navigate(['/'], {
      queryParams: { restart: 1 }
    });
  }

  private resetInternalState() {
    clearInterval(this.intervalId);
    this.time.set(0);
    this.running.set(false);
    this.finished.set(false);
    this.unableToPerform.set(false);
  }

  private getScoreForTime(timeMs: number): number {
    if (timeMs >= 60000) return 0;

    const seconds = timeMs / 1000;
    if (seconds < 11.19) return 4;
    if (seconds <= 13.69) return 3;
    if (seconds <= 16.69) return 2;
    if (seconds <= 59.99) return 1;
    return 0;
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
