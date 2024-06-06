import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastCtrl = inject(ToastController);

  private async presentToast(text: string, color = 'primary') {
    const toast = await this.toastCtrl.create({
      color: color,
      message: text,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  public errorMessage(title: string) {
    this.presentToast(title, 'danger');
  }

  public successMessage(title: string) {
    this.presentToast(title, 'success');
  }
}
