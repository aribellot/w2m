import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {

  spinnerCtrl = inject(LoadingController)

  loaderCount = 0;
  isLoading = false;

  constructor() {}

  public async showLoader() {
    this.loaderCount++;
    if (!this.isLoading) {
      this.isLoading = true;
      return this.spinnerCtrl
        .create({
          cssClass: 'my-loading-class',
        })
        .then((a) => {
          a.present().then(() => {
            if (!this.isLoading) {
              a.dismiss();
            }
          });
        });
    }
  }

  public async hideLoader() {
    this.loaderCount--;
    if (this.loaderCount === 0 || this.loaderCount < 0) {
      this.loaderCount = 0;
      this.isLoading = false;
      return this.spinnerCtrl.dismiss();
    }
    return null;
  }
}
