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
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
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
  imports: [
    IonSearchbar,
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
    IonSelect,
    IonSelectOption,
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
  searhName: string = '';
  sortType: string = '';

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
    this.searhName = event.target.value.toLowerCase();
    this.filterAndSortHeroes(this.searhName, this.sortType);
  }

  doSort(event: any) {
    this.spinnerService.showLoader();
    this.sortType = event.detail.value;
    this.filterAndSortHeroes(this.searhName, this.sortType);
  }

  filterAndSortHeroes(name: string, sortTpe: string): void {
    this.filteredHeroes$ = this.heroes$.pipe(
      map((heroes) =>
        heroes
          .filter((hero) =>
            hero.name.toLowerCase().includes(name.toLowerCase())
          )
          .sort((a, b) => {
            if (sortTpe === 'newest') {
              return a.id.localeCompare(b.id);
            } else if (sortTpe === 'older') {
              return b.id.localeCompare(a.id);
            } else if (sortTpe === 'nameAsc') {
              return a.name.localeCompare(b.name);
            } else if (sortTpe === 'nameDesc') {
              return b.name.localeCompare(a.name);
            } else {
              return a.name.localeCompare(b.name);
            }
          })
      )
    );
    this.spinnerService.hideLoader();
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
        this.toastService.successMessage(
          'something went wront!!! try it again'
        );
      },
      complete: () => {
        this.getHeroes();
      },
    });
  }
}
