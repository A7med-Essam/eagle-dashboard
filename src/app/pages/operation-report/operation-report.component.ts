import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CarService } from "app/shared/services/car.service";
import { OperationService } from "app/shared/services/operation.service";
import { OurCarService } from "app/shared/services/our-car.service";
import { SalesReportService } from "app/shared/services/sales-report.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { UsersService } from "app/shared/services/users.service";

@Component({
  selector: "app-operation-report",
  templateUrl: "./operation-report.component.html",
  styleUrls: ["./operation-report.component.scss"],
})
export class OperationReportComponent implements OnInit {
  pagination: any;
  reports: any[] = [];
  filterModal: boolean = false;
  selectedRow: any;

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;

  filterForm: FormGroup = new FormGroup({});

  constructor(
    private _OperationService: OperationService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _UsersService: UsersService,
    // private _CarService: CarService,
    private _OurCarService: OurCarService,
    private _FormBuilder: FormBuilder
  ) {
    // this.gearType = [
    //   { name: "Automatic", value: "AUTOMATIC" },
    //   { name: "Manual", value: "MANUAL" },
    // ];
    // const currentYear = new Date().getFullYear() + 1;
    // for (let i = 2015; i <= currentYear; i++) {
    //   this.carModel.push({ name: `Model ${i}`, value: `${i}` });
    // }
  }

  ngOnInit() {
    this.getReports();
    this.setFilterForm();
    this.getCars();
    this.getAdmins();
    this.getArea();
  }

  // Curd Settings
  getReports(page = 1) {
    this._OperationService.getOperationReport(page).subscribe({
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

  // Pagination
  loadPage(page: number) {
    this.getReports(page);
  }

  // Export
  export() {
    this._OperationService.exportOperationReport().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Filter
  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      admin_id: new FormControl(null),
      // from: new FormControl(null),
      // to: new FormControl(null),
      car_id: new FormControl(null),
      area: new FormControl(null),
      plate_no: new FormControl(null),
    });
  }

  resetFilter() {
    this.getReports();
    this.setFilterForm();
    this.filterStatus = false;
  }
  filterStatus = false;

  filter(form: any) {
    if (!form.value.car_id) delete form.value.car_id;
    if (!form.value.area) delete form.value.area;
    if (!form.value.plate_no) delete form.value.plate_no;
    if (!form.value.admin_id) delete form.value.admin_id;
    form.value.withoutPagination = 0;
    this._OperationService.filterOperationReport(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        // this.reports = res.data.data;
        this.reports = res.data;
        // this.pagination = res.data;
        this.setFilterForm();
        this.filterStatus = true;
        this.pagination = null;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  exportLeadsWithFilter() {
    let filteredRows = [];
    this.reports.forEach((e) => {
      filteredRows.push(e.id);
    });
    this._OperationService
      .exportWithFilter({ operationIds: filteredRows })
      .subscribe({
        next: (res) => {
          const link = document.createElement("a");
          link.href = res.data;
          link.click();
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  // gearType: any[] = [];
  // carModel: any[] = [];

  // insurance: any[] = [];
  // grade: any[] = [];
  // carType: any[] = [];
  // carName: any[] = [];
  // carColor: any[] = [];

  // Car Settings
  // getCarName() {
  //   // this.carName = [{ name: "Select Car Name", value: "" }];
  //   this._CarService.getCarName().subscribe({
  //     next: (res) => {
  //       res.data.forEach((e: any) => {
  //         this.carName.push({ name: e.car_name, value: e.car_name });
  //       });
  //     },
  //     error: (err) => {
  //       // this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  // getCarColor() {
  //   // this.carColor = [{ name: "Select Car Color", value: "" }];
  //   this._CarService.getCarColor().subscribe({
  //     next: (res) => {
  //       res.data.forEach((e: any) => {
  //         this.carColor.push({ name: e.car_color, value: e.car_color });
  //       });
  //     },
  //     error: (err) => {
  //       // this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  // getCarType() {
  //   // this.carType = [{ name: "Select Car Type", value: "" }];
  //   this._CarService.getCarType().subscribe({
  //     next: (res) => {
  //       res.data.forEach((e: any) => {
  //         this.carType.push({ name: e.car_type, value: e.car_type });
  //       });
  //     },
  //     error: (err) => {
  //       // this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  // getGrade() {
  //   // this.grade = [{ name: "Select Grade", value: "" }];
  //   this._CarService.getGrade().subscribe({
  //     next: (res) => {
  //       res.data.forEach((e: any) => {
  //         this.grade.push({ name: `Grade ${e.grade}`, value: e.grade });
  //       });
  //     },
  //     error: (err) => {
  //       // this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  // getInsurance() {
  //   // this.insurance = [{ name: "Select Insurance", value: "" }];
  //   this._CarService.getInsurance().subscribe({
  //     next: (res) => {
  //       res.data.forEach((e: any) => {
  //         this.insurance.push({ name: e.status, value: e.status });
  //       });
  //     },
  //     error: (err) => {
  //       // this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  users: Array<any> = [];

  getAdmins() {
    this._UsersService.getAdmins().subscribe({
      next: (res) => (this.users = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  cars: any[] = [];
  plate_no: any[] = [];
  getCars() {
    this._OurCarService.getOurCarsWithoutPagination().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.cars.push({
            name: e.name,
            id: e.id,
          });

          this.plate_no.push({
            name: e.plate_no,
            id: e.plate_no,
          });
        });
      },
    });
  }

  area: any[] = [];
  getArea() {
    this._OperationService.getAreaWithoutPagination().subscribe({
      next: (res) => {
        this.area = res.data;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }
}
