import { Component, Input, OnInit, inject, input } from '@angular/core';
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
  IonInput,
  IonCol,
  IonItem,
  IonButton,
  IonImg,
  IonText,
  IonList,
  IonRow,
} from '@ionic/angular/standalone';
import { HeroService } from '../../services/hero.service';
import { ToastService } from 'src/app/core/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: 'edit.page.html',
  styleUrls: ['edit.page.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonList,
    IonText,
    IonImg,
    IonButton,
    IonItem,
    IonCol,
    IonInput,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ReactiveFormsModule,
  ],
})
export class EditPage implements OnInit {
  @Input({ required: true }) id: number = 0;
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
      id: [''],
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

  ngOnInit(): void {
    this.heroService.getHero(this.id).subscribe({
      next: (data) => {
        this.heroForm.controls['id'].setValue(data.id);
        this.heroForm.controls['name'].setValue(data.name);
        this.heroForm.controls['realName'].setValue(data.realName);
        this.heroForm.controls['city'].setValue(data.city);
        this.heroForm.controls['imgUrl'].setValue(data.imgUrl);
        this.imagePreview = data.imgUrl ? data.imgUrl : this.imagePreview;
      },
      error: (err) => {
        this.router.navigate(['error']);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  onSubmit(): void {
    if (this.heroForm.valid) {
      const hero = this.heroForm.value;
      this.heroService.updateHero(hero).subscribe({
        next: () => {
          this.toastService.successMessage('Hero updated!!!');
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
}
