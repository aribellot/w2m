import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPage } from './list.page';
import { AlertController } from '@ionic/angular';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Hero } from '../../models/hero';
import { HeroService } from '../../services/hero.service';
import { ToastService } from 'src/app/core/toast/toast.service';

describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;
  let alertController: jasmine.SpyObj<AlertController>;
  let heroService: jasmine.SpyObj<HeroService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let router: jasmine.SpyObj<Router>;

  const heroesMock: Hero[] = [
    {
      id: '1',
      name: 'Hero 1',
      realName: 'Name hero 1',
      city: 'City hero 1',
    },
    {
      id: '2',
      name: 'Hero 2',
      realName: 'Name hero 2',
      city: 'City hero 2',
    },
  ];

  beforeEach(async () => {
    const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    const heroServiceSpy = jasmine.createSpyObj('HeroService', [
      'getHeroes',
      'deleteHero',
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['successMessage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    heroService = TestBed.inject(HeroService) as jasmine.SpyObj<HeroService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getHeroes on ionViewWillEnter', () => {
    spyOn(component, 'getHeroes');
    component.ionViewWillEnter();
    expect(component.getHeroes).toHaveBeenCalled();
  });

  it('should get heroes from heroService on getHeroes', () => {
    heroService.getHeroes.and.returnValue(of(heroesMock));
    component.getHeroes();
    component.heroes$.subscribe((data) => {
      expect(data).toEqual(heroesMock);
    });
  });

  it('should filter heroes by name asc', () => {
    heroService.getHeroes.and.returnValue(of(heroesMock));
    component.getHeroes();
    component.filterAndSortHeroes('Hero 1', 'nameAsc');
    component.filteredHeroes$?.subscribe((data) => {
      expect(data).toEqual([
        {
          id: '1',
          name: 'Hero 1',
          realName: 'Name hero 1',
          city: 'City hero 1',
        },
      ]);
    });
  });

  it('should navigate to edit page on goToEdit', () => {
    const id = '1';
    component.goToEdit(id);
    expect(router.navigate).toHaveBeenCalledWith([`heroes/edit/${id}`]);
  });

  it('should show an alert and call doDelete on confirmDelete', async () => {
    const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertController.create.and.returnValue(Promise.resolve(alertSpy));
    const id = '1';

    await component.confirmDelete(id);
    expect(alertController.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  });

  it('should delete hero and show success message on doDelete', () => {
    const id = '1';
    heroService.deleteHero.and.returnValue(of(heroesMock[0]));
    spyOn(component, 'getHeroes');

    component.doDelete(id);
    expect(heroService.deleteHero).toHaveBeenCalledWith(id);
    expect(toastService.successMessage).toHaveBeenCalledWith('Hero deleted!!!');
    expect(component.getHeroes).toHaveBeenCalled();
  });
});
