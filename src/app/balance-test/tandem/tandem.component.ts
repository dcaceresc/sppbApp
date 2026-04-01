import { Component, OnDestroy, signal, computed, Output, EventEmitter } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonButton,
  IonProgressBar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { footsteps } from 'ionicons/icons';

@Component({
  selector: 'app-tandem',
  templateUrl: './tandem.component.html',
  styleUrls: ['./tandem.component.scss'],
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonButton, IonProgressBar]
})
export class TandemComponent implements OnDestroy {

  time = signal(0);
  running = signal(false);

  @Output() result = new EventEmitter<number>();
  @Output() skipToSpeedTest = new EventEmitter<void>();

  private intervalId: any;

  constructor() {
    addIcons({ footsteps });
  }

  seconds = computed(() => Math.floor(this.time() / 1000));
  milliseconds = computed(() => this.time() % 1000);
  displayMilliseconds = computed(() => Math.floor(this.milliseconds() / 100));
  progress = computed(() => this.time() / 10000);
  buttonText = computed(() => this.running() ? 'Stop' : 'Start');
  buttonColor = computed(() => this.running() ? 'danger' : 'success');

  toggleTimer() {
    if (this.running()) {
      this.stopTimer();
      this.submitResult();
      if (this.time() < 10000) {
        this.skipToSpeedTest.emit();
      }
    } else {
      this.startTimer();
    }
  }

  cannotPerform() {
    this.stopTimer();
    this.time.set(0);
    this.result.emit(0);
    this.skipToSpeedTest.emit();
  }

  submitResult() {
    const elapsed = this.time();

    if (elapsed >= 10000) {
      this.result.emit(2);
      return;
    }

    if (elapsed >= 3000) {
      this.result.emit(1);
      return;
    }

    this.result.emit(0);
  }

  startTimer() {
    this.running.set(true);
    const start = Date.now() - this.time();
    this.intervalId = setInterval(() => {
      const current = Date.now() - start;
      if (current >= 10000) {
        this.time.set(10000);
        this.stopTimer();
        this.submitResult();
        return;
      }
      this.time.set(current);
    }, 10);
  }

  stopTimer() {
    this.running.set(false);
    clearInterval(this.intervalId);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

}
