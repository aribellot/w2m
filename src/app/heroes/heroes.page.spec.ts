import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HeroesPage } from './heroes.page';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA, EnvironmentInjector } from '@angular/core';
import { addIcons } from 'ionicons';
import { listOutline, createOutline } from 'ionicons/icons';
import { ErrorPage } from '../error/error.page';

describe('HeroesPage', () => {
  let component: HeroesPage;
  let fixture: ComponentFixture<HeroesPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        HeroesPage,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel,
      ],
      providers: [
        { provide: Router, useValue: spy },
        EnvironmentInjector,
        NavController,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    addIcons({ listOutline, createOutline });

    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
