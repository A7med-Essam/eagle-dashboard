import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private _ApiService: ApiService) {}

  getCustomerProfile(): Observable<any> {
    return this._ApiService.postReq(`customer/profile`, "");
  }

  getCustomerContracts(): Observable<any> {
    return this._ApiService.postReq(`customer/myContracts`, "");
  }

  updateCustomerProfile(name): Observable<any> {
    return this._ApiService.postReq(`customer/updateProfile`, { name });
  }
}
