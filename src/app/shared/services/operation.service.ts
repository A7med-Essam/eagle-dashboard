import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OperationService {
  constructor(private _ApiService: ApiService) {}

  getOperationContracts(page = 1): Observable<any> {
    return this._ApiService.postReq(`allOperationContractsV2?page=${page}`, "");
  }

  createContract(contract): Observable<any> {
    return this._ApiService.postReq(`createContract`, contract);
  }

  assignContract(contract): Observable<any> {
    return this._ApiService.postReq(`assignContract`, contract);
  }

  logContract(contract): Observable<any> {
    return this._ApiService.postReq(`logContract`, contract);
  }

  // Area settings
  getArea(page = 1): Observable<any> {
    return this._ApiService.postReq(`areas?page=${page}`, "");
  }

  createArea(name): Observable<any> {
    return this._ApiService.postReq(`areas/create`, { name: name });
  }

  deleteArea(area_id): Observable<any> {
    return this._ApiService.postReq(`areas/delete`, { area_id: area_id });
  }

  getOperationReport(page = 1): Observable<any> {
    return this._ApiService.postReq(`operationReport?page=${page}`, "");
  }

  exportOperationReport(): Observable<any> {
    return this._ApiService.postReq(`operationReport/export`, "");
  }

  filterOperationReport(filter): Observable<any> {
    return this._ApiService.postReq(`operationReport`, filter);
  }

  exportWithFilter(filter): Observable<any> {
    return this._ApiService.postReq("printOperationReport", filter);
  }

  getAreaWithoutPagination(): Observable<any> {
    return this._ApiService.postReq(`areas`, { withoutPagination: 0 });
  }
}
