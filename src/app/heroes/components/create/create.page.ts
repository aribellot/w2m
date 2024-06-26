import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCol,
  IonRow,
  IonInput,
  IonList,
  IonItem,
  IonText,
  IonImg,
  IonButton,
} from '@ionic/angular/standalone';
import { HeroService } from '../../services/hero.service';
import { ToastService } from 'src/app/core/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: 'create.page.html',
  styleUrls: ['create.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonImg,
    IonText,
    IonItem,
    IonList,
    IonInput,
    IonRow,
    IonCol,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ReactiveFormsModule,
  ],
})
export class CreatePage {
  fb = inject(FormBuilder);
  heroService = inject(HeroService);
  toastService = inject(ToastService);
  router = inject(Router);

  defaultImage =
    'https://logowik.com/content/uploads/images/949_anonymous_logo.jpg';
  heroForm: FormGroup;
  imagePreview: string;

  constructor() {
    this.imagePreview = this.defaultImage;
    this.heroForm = this.fb.group({
      id: [this.generateId()],
      name: ['', Validators.required],
      realName: ['', Validators.required],
      city: ['', Validators.required],
      imgUrl: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/
          ),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.heroForm.valid) {
      const hero = this.heroForm.value;
      this.heroService.addHero(hero).subscribe({
        next: () => {
          this.toastService.successMessage('Hero added!!!');
        },
        error: () => {
          this.toastService.errorMessage('Something went wrong, try it again!!!');
        },
        complete: () => {
          this.router.navigate(['heroes/list']);
        },
      });
    }
  }

  updateImgPreview(): void {
    if (this.heroForm.controls['imgUrl'].valid) {
      this.imagePreview = this.heroForm.controls['imgUrl'].value;
    } else {
      this.imagePreview = this.defaultImage;
    }
  }

  generateId(): string {
    return `${Math.floor(Math.random() * (10000000 - 1) + 1)}`;
  }
}
