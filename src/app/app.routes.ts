import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./balance-test/balance-test.page').then( m => m.BalanceTestPage)
  },
  {
    path: 'speed-test',
    loadComponent: () => import('./speed-test/speed-test.page').then( m => m.SpeedTestPage)
  },
  {
    path: 'chair-stand-test',
    loadComponent: () => import('./chair-stand-test/chair-stand-test.page').then( m => m.ChairStandTestPage)
  },
  {
    path: 'final-results',
    loadComponent: () => import('./final-results/final-results.page').then( m => m.FinalResultsPage)
  },
];
