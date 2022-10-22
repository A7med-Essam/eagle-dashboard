import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SalesReportService } from "app/shared/services/sales-report.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "sales-report-cmp",
  moduleId: module.id,
  templateUrl: "sales-report.component.html",
})
export class SalesReportComponent {
  pagination: any;
  reports: any[] = [];
  filterModal: boolean = false;
  selectedRow: any;

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;

  filterForm: FormGroup = new FormGroup({});

  constructor(
    private _SalesReportService: SalesReportService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _FormBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getReports();
    this.setFilterForm();
  }

  // Curd Settings
  getReports(page = 1) {
    this._SalesReportService.getSalesReport(page).subscribe({
      next: (res) => {
        this.reports = res.data.data;
        this.pagination = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getById(id: any) {
    [this.selectedRow] = this.reports.filter((c) => c.id == id);
    this.displayDetails();
  }

  // Set Reactive Forms
  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      created_at: new FormControl(null),
    });
  }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInCustomerTable();
  }

  fadeInCustomerTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

  // display animation
  displayDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  // Filter
  filter(form: any) {
    form.patchValue({
      created_at: form.value.created_at
        .toLocaleString("en-us", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"),
    });
    this._SalesReportService.filterSalesReport(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        this.reports = res.data.data;
        this.pagination = res.data;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  resetFilter() {
    this.getReports();
  }

  // Pagination
  loadPage(page: number) {
    this.getReports(page);
  }

  // Export
  export() {
    this._SalesReportService.exportReports().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }
}
