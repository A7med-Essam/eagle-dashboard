import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CarService {
  constructor(private _ApiService: ApiService) {}

  // Name
  getCarName(): Observable<any> {
    return this._ApiService.postReq("allCarName", "");
  }

  createCarName(car_name): Observable<any> {
    return this._ApiService.postReq("addCarName", { car_name: car_name });
  }

  deleteCarName(car_name_id): Observable<any> {
    return this._ApiService.postReq("leads", { car_name_id: car_name_id });
  }

  // color
  getCarColor(): Observable<any> {
    return this._ApiService.postReq("allCarColor", "");
  }

  createCarColor(car_color): Observable<any> {
    return this._ApiService.postReq("addCarColor", { car_color: car_color });
  }

  deleteCarColor(car_color_id): Observable<any> {
    return this._ApiService.postReq("deleteCarColor", {
      car_color_id: car_color_id,
    });
  }

  // Type

  getCarType(): Observable<any> {
    return this._ApiService.postReq("allCarType", "");
  }

  createCarType(car_type): Observable<any> {
    return this._ApiService.postReq("addCarType", { car_type: car_type });
  }

  deleteCarType(car_type_id): Observable<any> {
    return this._ApiService.postReq("deleteCarType", {
      car_type_id: car_type_id,
    });
  }
}
