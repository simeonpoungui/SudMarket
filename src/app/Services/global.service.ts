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
}
