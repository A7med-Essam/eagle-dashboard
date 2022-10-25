import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  constructor(private _ApiService: ApiService) {}

  getCustomers(page = 1): Observable<any> {
    return this._ApiService.postReq(`customers?page=${page}`, "");
  }

  createCustomers(customer): Observable<any> {
    return this._ApiService.postReq("customers/create", customer);
  }

  updateCustomers(customer): Observable<any> {
    return this._ApiService.postReq("customers/update", customer);
  }

  deleteCustomers(cid): Observable<any> {
    return this._ApiService.postReq("customers/delete", { cid: cid });
  }

  filterCustomers(filter): Observable<any> {
    return this._ApiService.postReq("customers", filter);
  }

  exportCustomers(): Observable<any> {
    return this._ApiService.postReq("customers/exportcustomers", "");
  }

  restoreCustomers(): Observable<any> {
    return this._ApiService.postReq("customers/restore", "");
  }

  forceDeleteCustomers(): Observable<any> {
    return this._ApiService.postReq("customers/forceDelete", "");
  }

  trashedCustomers(): Observable<any> {
    return this._ApiService.postReq("customers/trashed", "");
  }

  getCustomersWithoutPagination(): Observable<any> {
    return this._ApiService.postReq(`customers`, { withoutPagination: "true" });
  }
}
