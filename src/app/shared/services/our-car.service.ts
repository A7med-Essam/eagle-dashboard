import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OurCarService {
  constructor(private _ApiService: ApiService) {}

  getOurCars(page = 1): Observable<any> {
    return this._ApiService.postReq(`ourCars?page=${page}`, "");
  }

  createOurCars(car): Observable<any> {
    return this._ApiService.postReq("ourCars/create", car);
  }

  updateOurCars(car): Observable<any> {
    return this._ApiService.postReq("ourCars/update", car);
  }

  deleteOurCars(cid): Observable<any> {
    return this._ApiService.postReq("ourCars/delete", { cid: cid });
  }

  filterOurCars(filter): Observable<any> {
    return this._ApiService.postReq("ourCars", filter);
  }

  exportOurCars(): Observable<any> {
    return this._ApiService.postReq("ourCars/exportourCars", "");
  }

  restoreOurCars(): Observable<any> {
    return this._ApiService.postReq("ourCars/restore", "");
  }

  forceDeleteOurCars(): Observable<any> {
    return this._ApiService.postReq("ourCars/forceDelete", "");
  }

  trashedOurCars(): Observable<any> {
    return this._ApiService.postReq("ourCars/trashed", "");
  }
}
