import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private _ApiService: ApiService) {}

  getEmployees(page = 1): Observable<any> {
    return this._ApiService.postReq(`employees?page=${page}`, "");
  }

  createEmployees(employee): Observable<any> {
    return this._ApiService.postReq("employees/create", employee);
  }

  updateEmployees(employee): Observable<any> {
    return this._ApiService.postReq("employees/update", employee);
  }

  deleteEmployees(eid): Observable<any> {
    return this._ApiService.postReq("employees/delete", { eid: eid });
  }

  filterEmployees(filter): Observable<any> {
    return this._ApiService.postReq("employees", filter);
  }

  exportEmployees(): Observable<any> {
    return this._ApiService.postReq("employees/exportEmployees", "");
  }

  restoreEmployees(): Observable<any> {
    return this._ApiService.postReq("employees/restore", "");
  }

  forceDeleteEmployees(): Observable<any> {
    return this._ApiService.postReq("employees/forceDelete", "");
  }

  trashedEmployees(): Observable<any> {
    return this._ApiService.postReq("employees/trashed", "");
  }
}
