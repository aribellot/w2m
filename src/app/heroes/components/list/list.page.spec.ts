import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ListPage } from './list.page';
import { HeroService } from '../../services/hero.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { ToastService } from 'src/app/core/toast/toast.service';
import { SpinnerService } from 'src/app/core/spinner/spinner.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Hero } from '../../models/hero';

describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;
  let heroService: jasmine.SpyObj<HeroService>;
  let alertController: jasmine.SpyObj<AlertController>;
  let toastService: jasmine.SpyObj<ToastService>;
  let spinnerService: jasmine.SpyObj<SpinnerService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const heroServiceSpy = jasmine.createSpyObj('HeroService', [
      'getHeroes',
      'deleteHero',
    ]);
    const alertControllerSpy = jasmine.createSpyObj('AlertController', [
      'create',
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'successMessage',
    ]);
    const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', [
      'showLoader',
      'hideLoader',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ListPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: SpinnerService, useValue: spinnerServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    heroService = TestBed.inject(HeroService) as jasmine.SpyObj<HeroService>;
    alertController = TestBed.inject(
      AlertController
    ) as jasmine.SpyObj<AlertController>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    spinnerService = TestBed.inject(
      SpinnerService
    ) as jasmine.SpyObj<SpinnerService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    heroService.getHeroes.and.returnValue(of([]));
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
    const heroes: Hero[] = [
      {
        id: '1',
        name: 'Hero 1',
        realName: 'a',
        city: 'a',
      },
      {
        id: '2',
        name: 'Hero 2',
        realName: 'b',
        city: 'b',
      },
    ];
    heroService.getHeroes.and.returnValue(of(heroes));
    component.getHeroes();
    component.heroes$.subscribe((data) => {
      expect(data).toEqual(heroes);
    });
  });

  it('should filter heroes by name', () => {
    const heroes: Hero[] = [
      {
        id: '1',
        name: 'Hero 1',
        realName: 'a',
        city: 'a',
      },
      {
        id: '2',
        name: 'Another Hero',
        realName: 'b',
        city: 'b',
      },
    ];
    heroService.getHeroes.and.returnValue(of(heroes));
    component.getHeroes();
    component.filterHeroes('Hero 1');
    component.filteredHeroes$.subscribe((data) => {
      expect(data).toEqual([
        {
          id: '1',
          name: 'Hero 1',
          realName: 'a',
          city: 'a',
        },
      ]);
    });
  });

  it('should sort heroes by name', () => {
    const heroes: Hero[] = [
      {
        id: '1',
        name: 'B Hero',
        realName: 'a',
        city: 'a',
      },
      {
        id: '2',
        name: 'A Hero',
        realName: 'b',
        city: 'b',
      },
    ];
    heroService.getHeroes.and.returnValue(of(heroes));
    component.getHeroes();
    component.sortHeroesByName();
    component.filteredHeroes$.subscribe((data) => {
      expect(data).toEqual([
        {
          id: '2',
          name: 'A Hero',
          realName: 'b',
          city: 'b',
        },
        {
          id: '1',
          name: 'B Hero',
          realName: 'a',
          city: 'a',
        },
        {
          id: '2',
          name: 'A Hero',
          realName: 'b',
          city: 'b',
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
    heroService.deleteHero.and.returnValue(of());
    spyOn(component, 'getHeroes');

    component.doDelete(id);
    expect(heroService.deleteHero).toHaveBeenCalledWith(id);
    expect(toastService.successMessage).toHaveBeenCalledWith('Hero deleted!!!');
    expect(component.getHeroes).toHaveBeenCalled();
  });
});
