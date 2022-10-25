import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarOwnerService } from "app/shared/services/car-owner.service";
import { CarService } from "app/shared/services/car.service";
import { CustomerService } from "app/shared/services/customer.service";
import { OperationService } from "app/shared/services/operation.service";
import { OurCarService } from "app/shared/services/our-car.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { UsersService } from "app/shared/services/users.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-our-cars",
  templateUrl: "./our-cars.component.html",
  styleUrls: ["./our-cars.component.scss"],
  providers: [ConfirmationService],
})
export class OurCarsComponent implements OnInit {
  pagination: any;
  ourCars: any[] = [];
  carGrade: any[] = [];
  carColor: any[] = [];
  carName: any[] = [];
  carModel: any[] = [];
  filterModal: boolean = false;
  selectedRow: any;
  currentEditRow: any;

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;

  ourCarsForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});

  constructor(
    private _OurCarService: OurCarService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _ConfirmationService: ConfirmationService,
    private _CarService: CarService,
    private _OperationService: OperationService,
    private _CustomerService: CustomerService,
    private _CarOwnerService: CarOwnerService,
    private _UsersService: UsersService,
    private _FormBuilder: FormBuilder
  ) {
    const currentYear = new Date().getFullYear() + 1;
    for (let i = 2015; i <= currentYear; i++) {
      this.carModel.push({ name: `Model ${i}`, value: `${i}` });
    }
  }

  ngOnInit() {
    this.getOurCars();
    this.setOurCarsForm();
    this.setFilterForm();
    this.getCarColor();
    this.getCarGrade();
    this.getCarName();
    this.getOwners();
    this.getCustomers();
    // this.getAdmins();
  }

  // Curd Settings
  getOurCars(page = 1) {
    this._OurCarService.getOurCars(page).subscribe({
      next: (res) => {
        this.ourCars = res.data.data;
        this.pagination = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getById(id: any) {
    [this.selectedRow] = this.ourCars.filter((car) => car.id == id);
    this.displayDetails();
  }

  createRow(form: any) {
    console.log(form);
    this._OurCarService.createOurCars(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getOurCars();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          this.fadeInOurCarsTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  editRow(form: any) {
    this.ourCarsForm.addControl(
      "cid",
      new FormControl(this.currentEditRow.id, Validators.required)
    );
    this._OurCarService.updateOurCars(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getOurCars();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.EditForm.nativeElement);
          this.fadeInOurCarsTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  deleteRow(id: any) {
    this._OurCarService.deleteOurCars(id).subscribe({
      next: (res) => {
        this.getOurCars();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  deleteConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteRow(id);
      },
    });
  }

  // Set Reactive Forms
  setOurCarsForm(car?: any) {
    let date = car?.license_end ? new Date(car?.license_end) : null;
    let grade = car?.grade ? Number(car?.grade) : null;
    this.ourCarsForm = this._FormBuilder.group({
      name: new FormControl(car?.name, [Validators.required]),
      model: new FormControl(car?.model, [Validators.required]),
      grade: new FormControl(grade, [Validators.required]),
      color: new FormControl(car?.color, [Validators.required]),
      plate_no: new FormControl(car?.plate_no, [Validators.required]),
      motor_no: new FormControl(car?.motor_no, [Validators.required]),
      chassis_no: new FormControl(car?.chassis_no, [Validators.required]),
      license_end: new FormControl(date, [Validators.required]),
      owner_id: new FormControl(car?.owner_id, [Validators.required]),
      customer_id: new FormControl(car?.customer_id, [Validators.required]),
    });
  }

  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      name: new FormControl(null),
      model: new FormControl(null),
      grade: new FormControl(null),
      color: new FormControl(null),
      plate_no: new FormControl(null),
      motor_no: new FormControl(null),
      chassis_no: new FormControl(null),
      license_end: new FormControl(null),
    });
  }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInOurCarsTable();
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.CreateForm.nativeElement);
    this.fadeInOurCarsTable();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.EditForm.nativeElement);
    this.fadeInOurCarsTable();
  }

  fadeInOurCarsTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

  // display animation
  displayCreateForm() {
    this.setOurCarsForm();
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.CreateForm.nativeElement);
    }, 800);
  }

  displayEditForm(car: any) {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.EditForm.nativeElement);
    }, 800);
    this.setOurCarsForm(car);
    this.currentEditRow = car;
  }

  displayDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  // Filter
  filter(form: any) {
    this._OurCarService.filterOurCars(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        this.ourCars = res.data.data;
        this.pagination = res.data;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  resetFilter() {
    this.getOurCars();
  }

  // Pagination
  loadPage(page: number) {
    this.getOurCars(page);
  }

  // Export
  export() {
    this._OurCarService.exportOurCars().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Car Settings
  getCarColor() {
    this._CarService.getCarColor().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carColor.push({ name: e.car_color, value: e.car_color });
        });
      },
    });
  }

  getCarGrade() {
    this._CarService.getGrade().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carGrade.push({ name: `Grade ${e.grade}`, value: e.id });
        });
      },
    });
  }

  getCarName() {
    this._CarService.getCarName().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carName.push({ name: e.car_name, value: e.car_name });
        });
      },
    });
  }

  // ****************************************************************************
  // AssignForm: FormGroup = new FormGroup({});
  // assignModal: boolean = false;
  // @ViewChild("AssignUsersForm") AssignUsersForm: HTMLFormElement;

  // setAdminForm() {
  //   this.AssignForm = this._FormBuilder.group({
  //     user_ids: new FormArray([]),
  //   });
  // }

  // getAssignedUsers() {
  //   const usersId =
  //     this.AssignUsersForm.nativeElement.querySelectorAll("input");
  //   const leadUsers = this.currentLead.lead_users;
  //   const formArray: FormArray = this.AssignForm.get("user_ids") as FormArray;
  //   if (leadUsers) {
  //     this.assignModal = true;
  //     for (let i = 0; i < usersId.length; i++) {
  //       for (let j = 0; j < leadUsers.length; j++) {
  //         if (Number(usersId[i].value) == leadUsers[j].user_id) {
  //           if (!formArray.value.includes(leadUsers[j].user_id.toString())) {
  //             usersId[i].checked = true;
  //             formArray.push(new FormControl(usersId[i].value));
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // assignUsers(users: FormGroup) {
  //   this._OperationService.assignContract({
  //       lead_id: this.currentLead.id,
  //       user_ids: users.value.user_ids,
  //     })
  //     .subscribe({
  //       next: (res) => {
  //         this._ToastrService.setToaster(res.message, "success", "success");
  //         this.assignModal = false;
  //         this.getLeadById(this.currentLead.id);
  //       },
  //       error: (err) =>
  //         this._ToastrService.setToaster(err.error.message, "error", "danger"),
  //     });
  // }

  // users: Array<any> = [];

  // getAdmins() {
  //   this._UsersService.getAdmins().subscribe({
  //     next: (res) => (this.users = res.data),
  //     error: (err) =>
  //       this._ToastrService.setToaster(err.error.message, "error", "danger"),
  //   });
  // }

  // ****************************************************************************
  owners: any[] = [];
  customers: any[] = [];
  // createForm: FormGroup = new FormGroup({});
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
  //       // this.getOperationContracts();
  //       // this.createModal = false;
  //     },
  //     error: (err) => {
  //       this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  getOwners() {
    this._CarOwnerService.getOwnersWithoutPagination().subscribe({
      next: (res) => {
        this.owners = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getCustomers() {
    this._CustomerService.getCustomersWithoutPagination().subscribe({
      next: (res) => {
        this.customers = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }
}
