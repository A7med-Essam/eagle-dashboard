import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "app/core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LeadsService {
  constructor(private _ApiService: ApiService) {}

  getLeads(page = 1): Observable<any> {
    return this._ApiService.getReq(`leads?page=${page}`);
  }

  // getLeadsWithoutPaginate(): Observable<any> {
  //   let params = new HttpParams().set("withoutPagination", "true");
  //   return this._ApiService.getReq(`leads`, params);
  // }

  getLeadsById(lead_id): Observable<any> {
    return this._ApiService.postReq("leads/show", { lead_id: lead_id });
  }

  createLeads(lead): Observable<any> {
    return this._ApiService.postReq("leads/create", lead);
  }

  updateLeads(lead): Observable<any> {
    return this._ApiService.postReq("leads/update", lead);
  }

  deleteLeads(lead_id): Observable<any> {
    return this._ApiService.postReq("leads/delete", { lead_id: lead_id });
  }

  replayLeads(replay): Observable<any> {
    return this._ApiService.postReq("leads/replay", replay);
  }

  assignUsers(Admins): Observable<any> {
    return this._ApiService.postReq("leads/assign", Admins);
  }

  getRepliesByLeadsId(lead_id): Observable<any> {
    return this._ApiService.postReq("lead/replies", { lead_id: lead_id });
  }

  filterLeads(filter): Observable<any> {
    return this._ApiService.getReq("leads", filter);
  }

  exportLeads(): Observable<any> {
    return this._ApiService.postReq("lead/exportLeads", "");
  }

  exportLeadsWithFilter(filter): Observable<any> {
    return this._ApiService.postReq("lead/printLeads", filter);
  }

  allReminderLeads(page = 1): Observable<any> {
    return this._ApiService.postReq(`leads/allReminderLeads?page=${page}`, "");
  }

  addReminderLead(reminder): Observable<any> {
    return this._ApiService.postReq("leads/addReminderLead", reminder);
  }

  checkDailyLeads(): Observable<any> {
    return this._ApiService.postReqWithoutLoader("leads/checkDailyLeads", "");
  }

  importLeads(file): Observable<any> {
    return this._ApiService.postReq("lead/importLeadsForEdit", file);
  }

  downloadSample(): Observable<any> {
    return this._ApiService.postReq("lead/sampleLeadsForEdit", "");
  }
}
