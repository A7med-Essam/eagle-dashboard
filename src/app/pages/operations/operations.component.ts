import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarOwnerService } from "app/shared/services/car-owner.service";
import { CustomerService } from "app/shared/services/customer.service";
import { LocalService } from "app/shared/services/local.service";
import { OperationService } from "app/shared/services/operation.service";
import { OurCarService } from "app/shared/services/our-car.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { UsersService } from "app/shared/services/users.service";

@Component({
  selector: "operations-cmp",
  moduleId: module.id,
  templateUrl: "operations.component.html",
})
export class OperationsComponent implements OnInit {
  pagination: any;
  pagination2: any;
  selectedRow: any;
  users: any[] = [];
  reports: any[] = [];
  cars: any[] = [];
  owners: any[] = [];
  customers: any[] = [];
  currentContract;

  assignModal: boolean = false;
  logModal: boolean = false;
  createModal: boolean = false;

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  @ViewChild("Show2") Show2: any;

  // filterModal: boolean = false;
  // filterForm: FormGroup = new FormGroup({});
  logForm: FormGroup = new FormGroup({});
  createForm: FormGroup = new FormGroup({});

  constructor(
    private _OperationService: OperationService,
    private _SharedService: SharedService,
    private _UsersService: UsersService,
    private _ToastrService: ToasterService,
    private _CarOwnerService: CarOwnerService,
    private _CustomerService: CustomerService,
    private _OurCarService: OurCarService,
    private _LocalService: LocalService,
    private _FormBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getOperationContracts();
    // this.getAdmins();
    this.setLogForm();
    this.getArea();
    // this.setCreateForm();
    // this.getCustomers();
    // this.getOurCars();
    // this.getOwners();
    // this.setFilterForm();
  }

  getOperationContracts(page = 1) {
    this._OperationService.getOperationContracts(page).subscribe({
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
  // setFilterForm() {
  // this.filterForm = this._FormBuilder.group({
  //   created_at: new FormControl(null),
  // });
  // }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInTable();
  }

  backDetailsBtn2() {
    this._SharedService.fadeOut(this.Show2.nativeElement);
    this.fadeInTable();
  }

  fadeInTable() {
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
  // filter(form: any) {
  // form.patchValue({
  //   created_at: form.value.created_at
  //     .toLocaleString("en-us", {
  //       year: "numeric",
  //       month: "2-digit",
  //       day: "2-digit",
  //     })
  //     .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"),
  // });
  // this._OperationService.filterSalesReport(form.value).subscribe({
  //   next: (res) => {
  //     this.filterModal = false;
  //     this.reports = res.data.data;
  //     this.pagination = res.data;
  //     this.setFilterForm();
  //   },
  //   error: (err) =>
  //     this._ToastrService.setToaster(err.error.message, "error", "danger"),
  // });
  // }

  // resetFilter() {
  // this.getOperationContracts();
  // }

  // Pagination
  loadPage(page: number) {
    this.getOperationContracts(page);
  }

  loadPage2(page: number) {
    this.getArea(page);
  }

  // Export
  // export() {
  // this._OperationService.exportReports().subscribe({
  //   next: (res) => {
  //     const link = document.createElement("a");
  //     link.href = res.data;
  //     link.click();
  //   },
  //   error: (err) =>
  //     this._ToastrService.setToaster(err.error.message, "error", "danger"),
  // });
  // }

  // ************************************************ NEW ************************************************

  // assignContract(userId) {
  //   const contract = {
  //     user_id: userId.selectedOption.id,
  //     operation_contract_id: this.currentContract,
  //   };
  //   this._OperationService.assignContract(contract).subscribe({
  //     next: (res) => {
  //       this._ToastrService.setToaster(res.message, "success", "success");
  //       this.getOperationContracts();
  //       this.assignModal = false;
  //     },
  //     error: (err) => {
  //       this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  // displayAssignContract(id) {
  //   this.currentContract = id;
  //   this.assignModal = true;
  // }

  displayLogContract(contract) {
    if (contract?.logs.length) this.logForm.controls["kilometer_in"].disable();
    else this.logForm.controls["kilometer_in"].enable();
    this.setLogForm(contract.id, contract?.logs.at(-1)?.kilometer_out);
    this.logModal = true;
  }

  // getAdmins() {
  //   this._UsersService.getAdmins().subscribe((res) => {
  //     this.users = res.data;
  //   });
  // }

  // Log Contract methods

  setLogForm(id?, kilometer_in?) {
    this.logForm = this._FormBuilder.group({
      operation_contract_id: new FormControl(id, [Validators.required]),
      user_id: new FormControl(this._LocalService.getJsonValue("userInfo").id, [
        Validators.required,
      ]),
      // lat: new FormControl(null, [Validators.required]),
      // lang: new FormControl(null, [Validators.required]),
      area: new FormControl(null, [Validators.required]),
      kilometer_in: new FormControl(kilometer_in, [Validators.required]),
      kilometer_out: new FormControl(null, [Validators.required]),
    });
  }

  logContract(contract) {
    this._OperationService.logContract(contract.value).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.getOperationContracts();
        this.logModal = false;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  // create Contract methods
  // setCreateForm() {
  //   this.createForm = this._FormBuilder.group({
  //     car_id: new FormControl(null, [Validators.required]),
  //     owner_id: new FormControl(null, [Validators.required]),
  //     customer_id: new FormControl(null, [Validators.required]),
  //   });
  // }

  // createContract(form) {
  //   this._OperationService.createContract(form.value).subscribe({
  //     next: (res) => {
  //       this._ToastrService.setToaster(res.message, "success", "success");
  //       this.getOperationContracts();
  //       this.createModal = false;
  //     },
  //     error: (err) => {
  //       this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  // getOwners() {
  //   this._CarOwnerService.getOwnersWithoutPagination().subscribe({
  //     next: (res) => {
  //       this.owners = res.data;
  //     },
  //     error: (err) => {
  //       this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  // getCustomers() {
  //   this._CustomerService.getCustomersWithoutPagination().subscribe({
  //     next: (res) => {
  //       this.customers = res.data;
  //     },
  //     error: (err) => {
  //       this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  // getOurCars() {
  //   this._OurCarService.getOurCarsWithoutPagination().subscribe({
  //     next: (res) => {
  //       this.cars = res.data;
  //     },
  //     error: (err) => {
  //       this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  @ViewChild("Settings") Settings: any;

  displaySettings() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Settings.nativeElement);
    }, 800);
  }

  backSettingBtn() {
    this._SharedService.fadeOut(this.Settings.nativeElement);
    this.fadeInTable();
  }

  areaModal: boolean = false;

  addArea(area: HTMLInputElement) {
    this._OperationService.createArea(area.value).subscribe({
      next: (res) => {
        this.getArea();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.areaModal = false;
        area.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  area: any[] = [];
  getArea(page = 1) {
    this._OperationService.getArea(page).subscribe({
      next: (res) => {
        this.area = res.data.data;
        this.pagination2 = res.data;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteArea(id) {
    this._OperationService.deleteArea(id).subscribe({
      next: (res) => {
        this.getArea();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  displayCarInfo() {
    this._SharedService.fadeOut(this.Show2.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  displayActionInfo() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show2.nativeElement);
    }, 800);
  }
}
