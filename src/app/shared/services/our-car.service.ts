import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OurCarService {
  constructor(private _ApiService: ApiService) {}

  getOurCars(page = 1): Observable<any> {
    return this._ApiService.postReq(`ourCarsV2?page=${page}`, "");
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

  // BUG: withoutPagination not working
  getOurCarsWithoutPagination(): Observable<any> {
    return this._ApiService.postReq(`ourCarsV2`, { withoutPagination: "true" });
  }

  updateImage(image): Observable<any> {
    return this._ApiService.postReq(`ourCars/files/update`, image);
  }

  deleteImage(file_id): Observable<any> {
    return this._ApiService.postReq(`ourCars/files/delete`, {
      file_id: file_id,
    });
  }

  uploadImage(image): Observable<any> {
    return this._ApiService.postReq(`ourCars/files/upload`, image);
  }

  getContracts(car_id): Observable<any> {
    return this._ApiService.postReq(`ourCars/getContractByCarId`, {
      car_id,
    });
  }
}
