import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  
  toastConfig = {
    positionClass: 'toast-center-center',
    timeOut: 3000,
    closeButton: true
  }
  date_comptable!: string;
  constructor(
    private toastrService: ToastrService,
    private router: Router
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
    let decimal = ' ' + device;

    if (formated[0] == separateur) {
      formated = formated.substring(1);
    }
    return formated + decimal;
  }

  formatPrixString(prix: any, separateur: string = ' ', device: string = 'FCFA') {
    let reverse: string[] = prix.toString().split('').reverse();
    let prixFormated: string = '';

    for (let i: number = 1; i <= reverse.length; i++) {
      prixFormated += reverse[i - 1];

      if (i % 3 === 0) {
        prixFormated += separateur;
      }
    }

    let formated = prixFormated.split('').reverse().join('');
    let decimal = ' ' + device;

    if (formated[0] == separateur) {
      formated = formated.substring(1);
    }
    return formated + decimal;
  }

  formatDate(dateString: any): string {
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

  getCurrentDateFormatted(date: Date) {
    const currentDate = new Date();
    date = currentDate
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    this.date_comptable = `${day}/${year}/${month}`;
    console.log(this.date_comptable);
    //  console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  }
  
  reloadComponent(uri: string){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri]);
    });
  }

  formatFrenchDateSessionVnte(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(date));
  }

  calculTotal(keyToCalculate: string, tab: Array<any>): number {
    let total = 0;
    if (tab && tab.length > 0) {
      for (let index = 0; index < tab.length; index++) {
        const nbr = Number(tab[index][keyToCalculate]);
        if (!isNaN(nbr)) {
          total += nbr;
        }
      }
    }
    return total;
  }
  
}
