import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CarPriceService {
  constructor(private _ApiService: ApiService) {}

  getCarPrice(page = 1): Observable<any> {
    return this._ApiService.postReq(`lead/carExpectedPrices?page=${page}`, "");
  }

  addCarPrice(car): Observable<any> {
    return this._ApiService.postReq(`lead/createNewCarExpectedPrices`, car);
  }

  updateCarPrice(car): Observable<any> {
    return this._ApiService.postReq(`lead/updateCarExpectedPrices`, car);
  }

  deleteCarPrice(car_expected_price_id): Observable<any> {
    return this._ApiService.postReq(`lead/deleteCarExpectedPrices`, {
      car_expected_price_id: car_expected_price_id,
    });
  }

  filterCarPrice(car): Observable<any> {
    return this._ApiService.postReq(`lead/carExpectedPrices`, car);
  }

  refreshCarPrice(): Observable<any> {
    return this._ApiService.postReq(`ourCars/addPriceToNewCarAdded`, "");
  }

  export(): Observable<any> {
    // TODO: need export end point
    return this._ApiService.postReq("ourCars/printCarExpectedPrices", "");
  }

  exportWithFilter(filter): Observable<any> {
    return this._ApiService.postReq("ourCars/printCarExpectedPrices", filter);
  }
}
