import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, createOutline } from 'ionicons/icons';

@Component({
  selector: 'app-heroes',
  templateUrl: 'heroes.page.html',
  styleUrls: ['heroes.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class HeroesPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ listOutline, createOutline });
  }
}
