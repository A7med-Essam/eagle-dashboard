import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CarMaintenanceService {
  constructor(private _ApiService: ApiService) {}

  getMaintenances(page = 1): Observable<any> {
    return this._ApiService.postReq(`maintenances/index?page=${page}`, "");
  }

  addMaintenances(car): Observable<any> {
    return this._ApiService.postReq(`maintenances/create`, car);
  }

  updateMaintenances(car): Observable<any> {
    return this._ApiService.postReq(`maintenances/update`, car);
  }

  deleteMaintenances(maintenance_center_id): Observable<any> {
    return this._ApiService.postReq(`maintenances/delete`, {
      maintenance_center_id: maintenance_center_id,
    });
  }

  filterMaintenances(car): Observable<any> {
    return this._ApiService.postReq(`maintenances/index`, car);
  }

  addBrandForMaintenanceCenter(car): Observable<any> {
    return this._ApiService.postReq(
      `maintenances/addBrandForMaintenanceCenter`,
      car
    );
  }

  deleteBrandForMaintenanceCenter(car): Observable<any> {
    return this._ApiService.postReq(
      `maintenances/deleteBrandForMaintenanceCenter`,
      car
    );
  }
}
