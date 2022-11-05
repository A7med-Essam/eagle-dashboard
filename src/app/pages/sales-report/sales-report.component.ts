import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarService } from "app/shared/services/car.service";
import { SalesReportService } from "app/shared/services/sales-report.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { UsersService } from "app/shared/services/users.service";
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
    private _UsersService: UsersService,
    private _CarService: CarService,
    private _FormBuilder: FormBuilder
  ) {
    this.gearType = [
      { name: "Automatic", value: "AUTOMATIC" },
      { name: "Manual", value: "MANUAL" },
    ];

    const currentYear = new Date().getFullYear() + 1;
    for (let i = 2015; i <= currentYear; i++) {
      this.carModel.push({ name: `Model ${i}`, value: `${i}` });
    }
  }

  ngOnInit() {
    this.getReports();
    this.setFilterForm();
    this.getCarName();
    this.getCarColor();
    this.getCarType();
    this.getGrade();
    this.getInsurance();
    this.getAdmins();
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

  // Filter
  setFilterForm() {
    // this.filterForm = this._FormBuilder.group({
    //   created_at: new FormControl(null),
    // });
    this.filterForm = this._FormBuilder.group({
      // customer_name: new FormControl(null),
      // customer_mobile: new FormControl(null),
      // car_name: new FormControl(null),
      // car_color: new FormControl(null),
      // car_type: new FormControl(null),
      // gear_type: new FormControl(null),
      // car_model: new FormControl(null),
      // grade: new FormControl(null),
      // kilometer: new FormControl(null),
      // insurance: new FormControl(null),
      admin_id: new FormControl(null),
      from: new FormControl(null),
      to: new FormControl(null),
      // created_at: new FormControl(null),
      // issue_date_between: new FormControl(null),
    });
  }

  resetFilter() {
    this.setFilterForm();
    this.getReports();
  }

  // filter(form: any) {
  //   form.patchValue({
  //     created_at: form.value.created_at
  //       .toLocaleString("en-us", {
  //         year: "numeric",
  //         month: "2-digit",
  //         day: "2-digit",
  //       })
  //       .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"),
  //   });
  //   // form.patchValue({
  //   //   created_at: form.value.created_at.map((range: Date) => {
  //   //     range
  //   //       .toLocaleString("en-us", {
  //   //         year: "numeric",
  //   //         month: "2-digit",
  //   //         day: "2-digit",
  //   //       })
  //   //       .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2");
  //   //   }),
  //   // });

  //   this._SalesReportService.filterSalesReport(form.value).subscribe({
  //     next: (res) => {
  //       this.filterModal = false;
  //       this.reports = res.data.data;
  //       this.pagination = res.data;
  //       this.setFilterForm();
  //     },
  //     error: (err) =>
  //       this._ToastrService.setToaster(err.error.message, "error", "danger"),
  //   });
  // }

  // filter(form: any) {
  //   let issue_dates = [];
  //   let issue_date_between = [];
  //   if (form.value.created_at) {
  //     if (form.value.created_at[1]) {
  //       for (let i = 0; i < form.value.created_at.length; i++) {
  //         issue_date_between.push(
  //           form.value.created_at[i]
  //             .toLocaleString("en-us", {
  //               year: "numeric",
  //               month: "2-digit",
  //               day: "2-digit",
  //             })
  //             .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2")
  //         );
  //       }
  //     } else {
  //       issue_dates.push(
  //         form.value.created_at
  //           .toLocaleString("en-us", {
  //             year: "numeric",
  //             month: "2-digit",
  //             day: "2-digit",
  //           })
  //           .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2")
  //       );
  //       issue_dates = issue_dates[0].slice(0, -1);
  //     }
  //   }
  //   form.patchValue({
  //     created_at: issue_dates,
  //     issue_date_between: issue_date_between,
  //   });
  //   if (!form.value.created_at || !form.value.created_at.length)
  //     delete form.value.created_at;
  //   if (!form.value.issue_date_between.length)
  //     delete form.value.issue_date_between;
  //   // if (!form.value.customer_name) delete form.value.customer_name;
  //   // if (!form.value.customer_mobile) delete form.value.customer_mobile;
  //   // if (!form.value.car_name) delete form.value.car_name;
  //   // if (!form.value.car_color) delete form.value.car_color;
  //   // if (!form.value.car_type) delete form.value.car_type;
  //   // if (!form.value.gear_type) delete form.value.gear_type;
  //   // if (!form.value.car_model) delete form.value.car_model;
  //   // if (!form.value.grade) delete form.value.grade;
  //   // if (!form.value.kilometer) delete form.value.kilometer;
  //   // if (!form.value.insurance) delete form.value.insurance;
  //   if (!form.value.name) delete form.value.name;

  //   this._SalesReportService.filterSalesReport(form.value).subscribe({
  //     next: (res) => {
  //       form.patchValue({
  //         created_at: null,
  //       });
  //       this.filterModal = false;
  //       this.reports = res.data.data;
  //       this.pagination = res.data;

  //       this.setFilterForm();
  //     },
  //     error: (err) =>
  //       this._ToastrService.setToaster(err.error.message, "error", "danger"),
  //   });
  // }

  filter(form: any) {
    if (!form.value.from) delete form.value.from;
    if (!form.value.to) delete form.value.to;
    if (form.value.from) {
      let fromDate = new Date(form.value.from);
      fromDate.setHours(fromDate.getHours() + 2);

      form.patchValue({
        from: fromDate.toISOString().split("T")[0],
      });
      if (!form.value.to) {
        let toDate = new Date();
        toDate.setHours(toDate.getHours() + 2);
        form.patchValue({
          to: toDate.toISOString().split("T")[0],
        });
      } else {
        let toDate = new Date(form.value.to);
        toDate.setHours(toDate.getHours() + 2);

        form.patchValue({
          to: toDate.toISOString().split("T")[0],
        });
      }
    }
    if (!form.value.admin_id) delete form.value.admin_id;
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

  // rangeDates: any;
  // @ViewChild("calendar") private calendar: any;
  // onSelect() {
  //   if (this.rangeDates[1]) {
  //     // If second date is selected
  //     this.calendar.overlayVisible = false;
  //   }
  // }

  gearType: any[] = [];
  carModel: any[] = [];

  insurance: any[] = [];
  grade: any[] = [];
  carType: any[] = [];
  carName: any[] = [];
  carColor: any[] = [];

  // Car Settings
  getCarName() {
    // this.carName = [{ name: "Select Car Name", value: "" }];
    this._CarService.getCarName().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carName.push({ name: e.car_name, value: e.car_name });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getCarColor() {
    // this.carColor = [{ name: "Select Car Color", value: "" }];
    this._CarService.getCarColor().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carColor.push({ name: e.car_color, value: e.car_color });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getCarType() {
    // this.carType = [{ name: "Select Car Type", value: "" }];
    this._CarService.getCarType().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carType.push({ name: e.car_type, value: e.car_type });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getGrade() {
    // this.grade = [{ name: "Select Grade", value: "" }];
    this._CarService.getGrade().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.grade.push({ name: `Grade ${e.grade}`, value: e.grade });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getInsurance() {
    // this.insurance = [{ name: "Select Insurance", value: "" }];
    this._CarService.getInsurance().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.insurance.push({ name: e.status, value: e.status });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  users: Array<any> = [];

  getAdmins() {
    this._UsersService.getAdmins().subscribe({
      next: (res) => (this.users = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }
}
