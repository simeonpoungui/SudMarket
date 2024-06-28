import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  
  toastConfig = {
    positionClass: 'toast-center-center',
    timeOut: 3500,
    closeButton: true
  }
  constructor(
    private toastrService: ToastrService,
  ) { }

  toastShow(msg: string, title: string, type: 'success' | 'error' | 'info' = 'success'){
    if(type == 'success'){
      this.toastrService.success(msg, title, this.toastConfig);
    }else if(type == 'error'){
      this.toastrService.error(msg, title, this.toastConfig);
    }else if(type == 'info'){
      this.toastrService.info(msg, title, this.toastConfig);
    }
  }

  formatPrix(prix: number, separateur: string = ' ', device: string = 'FCFA') {
    let reverse: string[] = prix.toString().split('').reverse();
    let prixFormated: string = '';

    for (let i: number = 1; i <= reverse.length; i++) {
      prixFormated += reverse[i - 1];

      if (i % 3 === 0) {
        prixFormated += separateur;
      }
    }

    let formated = prixFormated.split('').reverse().join('');
    let decimal = ',00 ' + device;

    if (formated[0] == separateur) {
      formated = formated.substring(1);
    }
    return formated + decimal;
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false // Pour afficher l'heure au format 24 heures
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
  }
  

}
