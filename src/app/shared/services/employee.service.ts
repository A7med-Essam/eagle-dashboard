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

  /////////////  ********** Employees Settings *********** ///////////////
  // Contracts
  getContracts(): Observable<any> {
    return this._ApiService.postReq("contracts", "");
  }

  createContracts(contract): Observable<any> {
    return this._ApiService.postReq("contracts/create", { contract: contract });
  }

  deleteContracts(contract_id): Observable<any> {
    return this._ApiService.postReq("contracts/delete", {
      contract_id: contract_id,
    });
  }

  // Job Titles
  getjobTitles(): Observable<any> {
    return this._ApiService.postReq("job_titles", "");
  }

  createjobTitles(job_title): Observable<any> {
    return this._ApiService.postReq("job_titles/create", {
      job_title: job_title,
    });
  }

  deletejobTitles(job_title_id): Observable<any> {
    return this._ApiService.postReq("job_titles/delete", {
      job_title_id: job_title_id,
    });
  }

  // Maritals
  getMaritals(): Observable<any> {
    return this._ApiService.postReq("maritals", "");
  }

  createMaritals(marital): Observable<any> {
    return this._ApiService.postReq("maritals/create", { marital: marital });
  }

  deleteMaritals(marital_id): Observable<any> {
    return this._ApiService.postReq("maritals/delete", {
      marital_id: marital_id,
    });
  }

  // Militaries
  getMilitaries(): Observable<any> {
    return this._ApiService.postReq("militaries", "");
  }

  createMilitaries(military): Observable<any> {
    return this._ApiService.postReq("militaries/create", {
      military: military,
    });
  }

  deleteMilitaries(military_id): Observable<any> {
    return this._ApiService.postReq("militaries/delete", {
      military_id: military_id,
    });
  }

  // Nationalities
  getNationalities(): Observable<any> {
    return this._ApiService.postReq("nationalities", "");
  }

  createNationalities(nationality): Observable<any> {
    return this._ApiService.postReq("nationalities/create", {
      nationality: nationality,
    });
  }

  deleteNationalities(nationality_id): Observable<any> {
    return this._ApiService.postReq("nationalities/delete", {
      nationality_id: nationality_id,
    });
  }

  // Religions
  getReligions(): Observable<any> {
    return this._ApiService.postReq("religions", "");
  }

  createReligions(religion): Observable<any> {
    return this._ApiService.postReq("religions/create", { religion: religion });
  }

  deleteReligions(religion_id): Observable<any> {
    return this._ApiService.postReq("religions/delete", {
      religion_id: religion_id,
    });
  }

  uploadFiles(file): Observable<any> {
    return this._ApiService.postReq(`employees/uploadFiles`, file);
  }

  deleteFiles(file_id): Observable<any> {
    return this._ApiService.postReq(`employees/files/delete`, {
      file_id: file_id,
    });
  }

  updateFiles(file): Observable<any> {
    return this._ApiService.postReq(`employees/files/update`, file);
  }
}
