import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { HeroService } from '../../services/hero.service';
import { Observable, map, of } from 'rxjs';
import { Hero } from '../../models/hero';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, AsyncPipe],
})
export class ListPage implements OnInit{

  private heroService = inject(HeroService);
  
  heroes$: Observable<Hero[]> = of([]);
  filteredHeroes$: Observable<Hero[]> | undefined;

  constructor() {}
  
  ngOnInit(): void {
    this.heroes$ = this.heroService.getHeroes();
    this.filteredHeroes$ = this.heroes$;
  }

  filterHeroes(name: string): void {
    this.filteredHeroes$ = this.heroes$.pipe(
      map(heroes => heroes.filter(hero => hero.name.toLowerCase().includes(name.toLowerCase())))
    );
  }

  sortHeroesByName(): void {
    this.filteredHeroes$ = this.heroes$.pipe(
      map(heroes => heroes.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  filterAndSortHeroes(name: string): void {
    this.filteredHeroes$ = this.heroes$.pipe(
      map(heroes => heroes
        .filter(hero => hero.name.toLowerCase().includes(name.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }
}
