import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ErrorPage } from './error.page';

describe('ErrorPage', () => {
  let component: ErrorPage;
  let fixture: ComponentFixture<ErrorPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [ ErrorPage ],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: spy },
      ],
    })
    .compileComponents();
    fixture = TestBed.createComponent(ErrorPage);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to heroes list', () => {
    component.navigateToList();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['heroes/list']);
  });
});
