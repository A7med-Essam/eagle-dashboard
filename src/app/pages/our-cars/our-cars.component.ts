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
  contractStatus: any[] = [];

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  @ViewChild("Show2") Show2: any;
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
    this.contractStatus = [
      { name: "Rented", value: "Rented" },
      { name: "Completed", value: "completed" },
      { name: "In Garage", value: "inGarage" },
    ];
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
    this.getAdmins();
    this.setAdminForm();
    this.setCreateContractForm();
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
    // const formData: FormData = new FormData();
    // formData.append("name", form.value.name);
    // formData.append("model", form.value.model);
    // formData.append("grade", form.value.grade);
    // formData.append("color", form.value.color);
    // formData.append("plate_no", form.value.plate_no);
    // formData.append("motor_no", form.value.motor_no);
    // formData.append("chassis_no", form.value.chassis_no);
    // formData.append("license_end", form.value.license_end);
    // formData.append("owner_id", form.value.owner_id);
    // formData.append("kilometer", form.value.kilometer);
    // formData.append("car_images", form.value.car_images);
    // formData.append("car_files", form.value.car_files);
    // form.value.car_images?.forEach((e) => {
    //   formData.append("car_images", e);
    // });
    // form.value.car_files?.forEach((e) => {
    //   formData.append("car_files", e);
    // });
    this.ourCarsForm.patchValue({
      car_subtype_id: form?.value?.car_subtype_id?.toString(),
    });
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
      kilometer: new FormControl(car?.kilometer, [Validators.required]),
      car_images: new FormControl(null),
      car_files: new FormControl(null),
      car_subtype_id: new FormControl(car?.sub_car?.id, [Validators.required]),
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
      kilometer: new FormControl(null),
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
    if (car.sub_car) {
      this.getCarSub(car.sub_car.car_name_id);
    }
    // else {
    //   const [id] = this.carName.filter((c) => {
    //     c.name == car.name ? c.id : 0;
    //   });
    //   console.log(id);
    // }
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
          this.carGrade.push({ name: `Grade ${e.grade}`, value: e.grade });
        });
      },
    });
  }

  getCarName() {
    this._CarService.getCarName().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carName.push({ name: e.car_name, value: e.car_name, id: e.id });
        });
      },
    });
  }

  // ****************************************************************************
  AssignForm: FormGroup = new FormGroup({});
  assignModal: boolean = false;
  @ViewChild("AssignUsersForm") AssignUsersForm: HTMLFormElement;

  setAdminForm() {
    this.AssignForm = this._FormBuilder.group({
      user_ids: new FormArray([]),
    });
  }

  getAssignedUsers() {
    this.resetAssignForm();
    const usersId =
      this.AssignUsersForm.nativeElement.querySelectorAll("input");
    const leadUsers = this.selectedRow.contracts[0].assign;
    const formArray: FormArray = this.AssignForm.get("user_ids") as FormArray;
    if (leadUsers) {
      this.assignModal = true;
      for (let i = 0; i < usersId.length; i++) {
        for (let j = 0; j < leadUsers.length; j++) {
          if (Number(usersId[i].value) == Number(leadUsers[j].user_id)) {
            if (!formArray.value.includes(leadUsers[j].user_id.toString())) {
              usersId[i].checked = true;
              formArray.push(new FormControl(usersId[i].value));
            }
          }
        }
      }
    }
  }

  assignUsers(users: FormGroup) {
    this._OperationService
      .assignContract({
        operation_contract_id: this.selectedRow?.contracts[0].id,
        user_ids: users.value.user_ids,
      })
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this._OurCarService.getOurCars(1).subscribe((res) => {
            this.assignModal = false;
            this.ourCars = res.data.data;
            this.pagination = res.data;
            this.getById(this.selectedRow.id);
          });
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
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

  onCheckChange(event, status: string = "edit") {
    const formArray: FormArray = this.AssignForm.get("user_ids") as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  resetAssignForm() {
    this.AssignForm.reset();
    this.AssignUsersForm.nativeElement
      .querySelectorAll("input")
      .forEach((u) => (u.checked = false));
  }

  // ****************************************************************************
  owners: any[] = [];
  customers: any[] = [];
  createContractForm: FormGroup = new FormGroup({});
  createContractModal: boolean = false;

  setCreateContractForm() {
    this.createContractForm = this._FormBuilder.group({
      car_id: new FormControl(this.selectedRow?.id, [Validators.required]),
      customer_id: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      fromDate: new FormControl(null, [Validators.required]),
      toDate: new FormControl(null, [Validators.required]),
    });
  }

  createContract(form) {
    // form.patchValue({
    //   fromDate: form.value.fromDate
    //     .toLocaleString("en-us", {
    //       year: "numeric",
    //       month: "2-digit",
    //       day: "2-digit",
    //     })
    //     .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"),
    // });

    // form.patchValue({
    //   toDate: form.value.toDate
    //     .toLocaleString("en-us", {
    //       year: "numeric",
    //       month: "2-digit",
    //       day: "2-digit",
    //     })
    //     .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"),
    // });

    let toDate = new Date(form.value.toDate);
    toDate.setHours(toDate.getHours() + 2);

    let fromDate = new Date(form.value.fromDate);
    fromDate.setHours(fromDate.getHours() + 2);

    form.patchValue({
      toDate: toDate.toJSON().split(".")[0].split("T").join(" "),
      // .toLocaleString("ar", { timeZone: "Egypt/Cairo" }),
      // .toISOString()
      // .match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)[0],
      // .toLocaleString("en-GB", { timeZone: "UTC" })
      // .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2")
      // .replace(",", ""),
    });

    form.patchValue({
      fromDate: fromDate.toJSON().split(".")[0].split("T").join(" "),
      // .toLocaleString("ar", { timeZone: "Egypt/Cairo" }),
      // .toISOString()
      // .match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)[0],
      // .toLocaleString("en-GB", { timeZone: "UTC" })
      // .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2")
      // .replace(",", ""),
    });

    this._OperationService.createContract(form.value).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this._OurCarService.getOurCars(1).subscribe((res) => {
          this.createContractModal = false;
          this.ourCars = res.data.data;
          this.pagination = res.data;
          this.getById(this.selectedRow.id);
        });
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });

    // form.patchValue({
    //   toDate: form.value.toDate
    //     .toLocaleString("en-GB", { timeZone: "UTC" })
    //     .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"),
    // });
    // console.log(form);
  }

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

  displayCarInfo() {
    this._SharedService.fadeOut(this.Show2.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  backDetailsBtn2() {
    this._SharedService.fadeOut(this.Show2.nativeElement);
    this.fadeInOurCarsTable();
  }

  displayContractInfo() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show2.nativeElement);
    }, 800);
  }

  // Upload
  uploadProccess(event, element, status: string) {
    let uploadedFile: any[] = [];
    for (let file of event?.files) {
      uploadedFile.push(file);
    }

    // uploadedFile.forEach((e) => {
    //   delete e.objectURL;
    // });

    if (status == "car_images") {
      this.ourCarsForm.patchValue({
        car_images: uploadedFile,
      });
      this.ourCarsForm.get("car_images").updateValueAndValidity();
    } else {
      this.ourCarsForm.patchValue({
        car_files: uploadedFile,
      });
    }

    this._ToastrService.setToaster(
      uploadedFile.length + " Files Uploaded Successfully",
      "info",
      "info"
    );

    setTimeout(() => {
      element.clear();
    }, 800);

    console.log(uploadedFile);
  }

  carSub: any[] = [];
  getCarSub(car) {
    this._CarService.getCarSub(car).subscribe({
      next: (res) => (this.carSub = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // ******************************************************
  uploadImage(event: any, status: string) {
    let reader = new FileReader();
    reader.readAsDataURL(event.files[0]);
    reader.onload = () => {
      let images = [];
      images.push(reader.result);
      if (status == "car_images") {
        this.ourCarsForm.patchValue({
          car_images: images,
        });
      } else if (status == "car_files") {
        this.ourCarsForm.patchValue({
          car_files: images,
        });
      }
      this._ToastrService.setToaster(
        " File Uploaded Successfully",
        "info",
        "info"
      );
    };
  }
  uploadedFiles: any[] = [];

  removeImage(status: string) {
    if (status == "car_images") {
      this.ourCarsForm.patchValue({
        car_images: null,
      });
    } else if (status == "car_files") {
      this.ourCarsForm.patchValue({
        car_files: null,
      });
    }
  }
}
