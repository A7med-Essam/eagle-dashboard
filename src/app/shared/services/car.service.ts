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
    return this._ApiService.postReq("deleteCarName", {
      car_name_id: car_name_id,
    });
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

  // Grade

  getGrade(): Observable<any> {
    return this._ApiService.postReq("allGrades", "");
  }

  createGrade(grade): Observable<any> {
    return this._ApiService.postReq("addGrades", { grade: grade });
  }

  deleteGrade(grade_id): Observable<any> {
    return this._ApiService.postReq("deleteGrades", {
      grade_id: grade_id,
    });
  }

  // Insurance

  getInsurance(): Observable<any> {
    return this._ApiService.postReq("allInsurances", "");
  }

  createInsurance(status): Observable<any> {
    return this._ApiService.postReq("addInsurances", { status: status });
  }

  deleteInsurance(insurance_id): Observable<any> {
    return this._ApiService.postReq("deleteInsurances", {
      insurance_id: insurance_id,
    });
  }

  // Sub Name
  getCarSub(car_name_id): Observable<any> {
    return this._ApiService.postReq("carSubType", {
      car_name_id: car_name_id,
      withoutPagination: "true",
    });
  }

  createCarSub(car): Observable<any> {
    return this._ApiService.postReq("addSubCar", car);
  }

  deleteCarSub(car_sub_id): Observable<any> {
    return this._ApiService.postReq("deleteSubCar", {
      car_sub_id: car_sub_id,
    });
  }
}
