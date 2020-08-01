import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {Globals} from '../../_config/globals';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController,
    private translateService: TranslateService
  ) {}

  /**
   * Custom and easy to implement toast service
   * @param message text to display
   * @param color the color type
   * @param error object with debug information
   */
  public async show(
    message: string,
    error: { message: string, origin: string } = null
  ): Promise<void> {
    await (await this.toastController.create({
      message: await this.translateService.get(message).toPromise(),
      color: error ? 'danger' : 'success',
      duration: Globals.toast.duration,
      position: Globals.toast.position
    })).present();

    if (error) {
      console.error(`Error at ${error.origin}. ${error.message}`);
    }
  }
}
