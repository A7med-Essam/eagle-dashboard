import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(
    private _ToastrService:ToastrService
  ) { }

  setToaster(message:string, type:string, color:string){
    this._ToastrService[type](
      `<span data-notify="icon" class="nc-icon nc-bell-55"></span>
       <span data-notify="message">${message}</span>`,
        "",
        {
          timeOut: 4000,
          enableHtml: true,
          closeButton: true,
          toastClass: `alert alert-${color} alert-with-icon`,
          positionClass: "toast-bottom-right"
        }
      );
  }
}
