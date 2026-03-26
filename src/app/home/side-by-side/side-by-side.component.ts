import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, signal, computed } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { footsteps } from 'ionicons/icons';

@Component({
  selector: 'app-side-by-side',
  templateUrl: './side-by-side.component.html',
  styleUrls: ['./side-by-side.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButton,
    DecimalPipe
  ]
})
export class SideBySideComponent implements OnDestroy {

  // 🔥 estado
  time = signal(0); // ms
  running = signal(false);

  private intervalId: any;

  constructor() {
    addIcons({ footsteps });
  }

  // ⏱️ derivados
  seconds = computed(() => Math.floor(this.time() / 1000));
  milliseconds = computed(() => this.time() % 1000);

displayMilliseconds = computed(() =>
  Math.floor(this.milliseconds() / 100) // 👈 solo 1 dígito (0–9)
);

  buttonText = computed(() => this.running() ? 'Stop' : 'Start');
  buttonColor = computed(() => this.running() ? 'danger' : 'success');

  toggleTimer() {
    if (this.running()) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.running.set(true);

    const start = Date.now() - this.time();

    this.intervalId = setInterval(() => {
      const current = Date.now() - start;

      // ⛔ cortar en 10 segundos
      if (current >= 10000) {
        this.time.set(10000);
        this.stopTimer();
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