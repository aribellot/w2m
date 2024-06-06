import { Component, EnvironmentInjector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent, IonRow, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, createOutline } from 'ionicons/icons';

@Component({
  selector: 'app-error',
  templateUrl: 'error.page.html',
  styleUrls: ['error.page.scss'],
  standalone: true,
  imports: [IonButton, IonRow, IonContent, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class ErrorPage {
  public environmentInjector = inject(EnvironmentInjector);
  public router = inject(Router)

  constructor() {
    addIcons({ listOutline, createOutline });
  }

  navigateToList() {
    this.router.navigate(['heroes/list']);
  }
}
