import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCardSubtitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { HeroService } from '../../services/hero.service';
import { Observable, map, of } from 'rxjs';
import { Hero } from '../../models/hero';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/core/toast/toast.service';
import { SpinnerService } from 'src/app/core/spinner/spinner.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
  standalone: true,
  imports: [IonSearchbar, 
    IonIcon,
    IonButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardSubtitle,
    IonCol,
    IonRow,
    IonGrid,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    AsyncPipe,
    TitleCasePipe,
  ],
})
export class ListPage {
  private heroService = inject(HeroService);
  alertController = inject(AlertController);
  toastService = inject(ToastService);
  spinnerService = inject(SpinnerService);
  router = inject(Router);
  heroes$: Observable<Hero[]> = of([]);
  filteredHeroes$: Observable<Hero[]> | undefined;

  constructor() {
    addIcons({ trashOutline, createOutline });
  }

  ionViewWillEnter() {
    this.getHeroes();
  }

  getHeroes() {
    this.heroes$ = this.heroService.getHeroes();
    this.filteredHeroes$ = this.heroes$;
  }

  doSearch(event: any) {
    this.spinnerService.showLoader();
    const name = event.target.value.toLowerCase();
    this.filterHeroes(name);
  }

  filterHeroes(name: string): void {
    this.filteredHeroes$ = this.heroes$.pipe(
      map((heroes) =>
        heroes.filter((hero) =>
          hero.name.toLowerCase().includes(name.toLowerCase())
        )
      )
    );
    this.spinnerService.hideLoader();
  }

  sortHeroesByName(): void {
    this.filteredHeroes$ = this.heroes$.pipe(
      map((heroes) => heroes.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  filterAndSortHeroes(name: string): void {
    this.filteredHeroes$ = this.heroes$.pipe(
      map((heroes) =>
        heroes
          .filter((hero) =>
            hero.name.toLowerCase().includes(name.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }

  goToEdit(id: string) {
    this.router.navigate([`heroes/edit/${id}`]);
  }

  async confirmDelete(id: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Warning',
      subHeader: 'Delete hero',
      message: 'Are you sure??',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.doDelete(id);
          },
        },
      ],
    });

    await alert.present();
  }

  doDelete(id: string): void {
    this.heroService.deleteHero(id).subscribe({
      next: () => {
        this.toastService.successMessage('Hero deleted!!!');
      },
      error: (err) => {
        this.toastService.successMessage('something went wront!!! try it again');
      },
      complete: () => {
        this.getHeroes();
      },
    });
  }
}
