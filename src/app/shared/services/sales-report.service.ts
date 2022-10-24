import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SalesReportService {
  constructor(private _ApiService: ApiService) {}

  getSalesReport(page = 1): Observable<any> {
    return this._ApiService.postReq(`lead/salesReport?page=${page}`, "");
  }

  exportReports(): Observable<any> {
    return this._ApiService.postReq(`lead/exportSalesReport`, "");
  }

  filterSalesReport(filter): Observable<any> {
    return this._ApiService.postReq("lead/salesReport", filter);
  }
}
