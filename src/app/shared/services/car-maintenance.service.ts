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

  // **********************************************

  getMaintenanceKilometer(): Observable<any> {
    return this._ApiService.postReq(`maintenances/allMaintenanceKilometer`, "");
  }

  createMaintenanceKilometer(kilometer): Observable<any> {
    return this._ApiService.postReq(
      `maintenances/createCarMaintenanceKilometer`,
      { kilometer }
    );
  }

  deleteMaintenanceKilometer(maintenance_kilometer_id): Observable<any> {
    return this._ApiService.postReq(`maintenances/deleteMaintenanceKilometer`, {
      maintenance_kilometer_id,
    });
  }

  // **********************************************

  getMaintenanceType(): Observable<any> {
    return this._ApiService.postReq(`maintenances/allMaintenanceType`, "");
  }

  createMaintenanceType(type): Observable<any> {
    return this._ApiService.postReq(
      `maintenances/createCarMaintenanceType`,
      type
    );
  }

  deleteMaintenanceType(maintenance_type_id): Observable<any> {
    return this._ApiService.postReq(`maintenances/deleteMaintenanceType`, {
      maintenance_type_id,
    });
  }

  // **********************************************

  getCarMaintenance(car_name_id): Observable<any> {
    return this._ApiService.postReq(`maintenances/getCarMaintenance`, {
      car_name_id,
    });
  }

  createCarMaintenance(car): Observable<any> {
    return this._ApiService.postReq(`maintenances/createCarMaintenance`, car);
  }

  updateCarMaintenance(car): Observable<any> {
    return this._ApiService.postReq(`maintenances/updateCarMaintenance`, car);
  }

  deleteCarMaintenance(car_name_maintenance_id): Observable<any> {
    return this._ApiService.postReq(`maintenances/deleteCarMaintenance`, {
      car_name_maintenance_id,
    });
  }

  filterBrands(car_name_id): Observable<any> {
    return this._ApiService.postReq(`maintenances/index`, {car_name_id});
  }
}
