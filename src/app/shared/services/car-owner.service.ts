import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CarOwnerService {
  constructor(private _ApiService: ApiService) {}

  getOwners(page = 1): Observable<any> {
    return this._ApiService.postReq(`owners?page=${page}`, "");
  }

  createOwners(car): Observable<any> {
    return this._ApiService.postReq("owners/create", car);
  }

  updateOwners(car): Observable<any> {
    return this._ApiService.postReq("owners/update", car);
  }

  deleteOwners(cid): Observable<any> {
    return this._ApiService.postReq("owners/delete", { cid: cid });
  }

  filterOwners(filter): Observable<any> {
    return this._ApiService.postReq("owners", filter);
  }

  exportOwners(): Observable<any> {
    return this._ApiService.postReq("owners/exportOwners", "");
  }

  restoreOwners(): Observable<any> {
    return this._ApiService.postReq("owners/restore", "");
  }

  forceDeleteOwners(): Observable<any> {
    return this._ApiService.postReq("owners/forceDelete", "");
  }

  trashedOwners(): Observable<any> {
    return this._ApiService.postReq("owners/trashed", "");
  }
}
