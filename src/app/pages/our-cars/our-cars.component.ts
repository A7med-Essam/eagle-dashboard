import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarMaintenanceService } from "app/shared/services/car-maintenance.service";
import { CarOwnerService } from "app/shared/services/car-owner.service";
import { CarService } from "app/shared/services/car.service";
import { CustomerService } from "app/shared/services/customer.service";
import { GuardService } from "app/shared/services/guard.service";
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
  @ViewChild("Show3") Show3: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;

  ourCarsForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});
  maintenanceForm: FormGroup = new FormGroup({});
  maintenanceForm2: FormGroup = new FormGroup({});

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
    private _GuardService: GuardService,
    private _CarMaintenanceService: CarMaintenanceService,
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

    this.uploadTypes = [
      { name: "cars", value: "cars" },
      { name: "contract", value: "contract" },
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
    this.setAdminForm2();
    this.setCreateContractForm();
    // this.setVideoForm();
    this.setMaintenanceForm();
    this.setMaintenanceForm2();
    this.setPermissions();
  }

  isSuperAdmin: boolean = false;
  setPermissions() {
    this.isSuperAdmin = this._GuardService.isSuperAdmin();
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
    let files;
    this._OurCarService.getFilesByCarId(id).subscribe({
      next(res) {
        files = res.data;
      },
      complete: () => {
        this.selectedRow.files = files;
      },
    });
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
          // this.getOurCars();
          this.ourCars.unshift(res.data);
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          this.fadeInOurCarsTable();
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
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
          // this.getOurCars();
          this.ourCars.map((e) => {
            if (e.id == res.data.id) {
              Object.assign(e, res.data);
            }
          });
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
        // this.getOurCars();
        this.ourCars = this.ourCars.filter((car) => car.id != id);
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
    let grade = car?.grade ? car?.grade : null;
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
      // car_images: new FormControl(null),
      // car_files: new FormControl(null),
      files: new FormControl(null),
      type: new FormControl(null),
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
      car_subtype_id: new FormControl(null),
    });
  }

  setMaintenanceForm(car?: any) {
    this.maintenanceForm = this._FormBuilder.group({
      car_id: new FormControl(this.currentMaintenanceCarId),
      maintenance_type_id: new FormControl(car?.maintenance_type_id, [
        Validators.required,
      ]),
      counter_last_time: new FormControl(car?.counter_last_time, [
        Validators.required,
      ]),
      kilometer_change_every: new FormControl(car?.kilometer_change_every, [
        Validators.required,
      ]),
      car_kilometer_out: new FormControl(car?.car_kilometer_out, [
        Validators.required,
      ]),
    });
  }

  setMaintenanceForm2() {
    this.maintenanceForm2 = this._FormBuilder.group({
      car_id: new FormControl(this.currentMaintenanceCarId),
      maintenance_type_id: new FormControl(null, [Validators.required]),
      counter_last_time: new FormControl(null, [Validators.required]),
      kilometer_change_every: new FormControl(null, [Validators.required]),
      car_kilometer_out: new FormControl(null, [Validators.required]),
    });
  }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInOurCarsTable();
    this.carVideos = null;
    this.uploadedVideo = null;
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
    this.setFilterForm();
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

  setAdminForm(contractId?) {
    this.AssignForm = this._FormBuilder.group({
      user_ids: new FormArray([]),
      operation_contract_id: new FormControl(contractId),
    });
  }

  getAssignedUsers(contract) {
    this.resetAssignForm();
    this.setAdminForm(contract.id);
    const usersId =
      this.AssignUsersForm.nativeElement.querySelectorAll("input");
    const leadUsers = contract.assign;
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
        operation_contract_id: users.value.operation_contract_id,
        user_ids: users.value.user_ids.filter(Number),
      })
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.assignModal = false;

          // this.selectedRow.contracts.map((e) => {
          //   if (e.id == users.value.operation_contract_id) {
          //     e.assign = res.data;
          //   }
          // });

          this.contracts.map((e) => {
            if (e.id == users.value.operation_contract_id) {
              e.assign = res.data;
            }
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
        if (res.status == 1) {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.createContractModal = false;
          // this.getById(this.selectedRow.id);
          // this._OurCarService.getOurCars(1).subscribe((res) => {
          //   this.ourCars = res.data.data;
          //   this.pagination = res.data;
          // });
          // this.ourCars.map((d) => {
          //   if (d.id == res.data.car_id) {
          //     // const newContract = {
          //     //   fromDate: res.data.fromDate,
          //     //   car_id: res.data.car_id,
          //     //   created_at: res.data.created_at,
          //     //   customer_id: res.data.customer_id,
          //     //   status: res.data.status,
          //     //   id: res.data.id,
          //     //   toDate: res.data.toDate,
          //     //   updated_at: res.data.updated_at,
          //     //   deleted_at: null,
          //     //   customer: null,
          //     //   assign: [],
          //     //   logs: [],
          //     // };
          //     d.contracts.push(res.data);
          //   }
          // });
          const [CUSTOMER] = this.customers.filter(
            (c) => c.id == res.data.customer_id
          );

          res.data.customer = CUSTOMER;
          res.data.assign = [];
          res.data.logs = [];
          // this.selectedRow.contracts.push(res.data);
          this.contracts.push(res.data);
        }
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
  }

  getOwners() {
    this._CarOwnerService.getOwnersWithoutPagination().subscribe({
      next: (res) => {
        // this.owners = res.data;
        this.owners = res.data.sort((a, b) => a.name.localeCompare(b.name));
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

  backDetailsBtn3() {
    this._SharedService.fadeOut(this.Show3.nativeElement);
    this.fadeInOurCarsTable();
  }

  displayContractInfo() {
    this.getContracts(this.selectedRow.id);
    this._SharedService.fadeOut(this.Show.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show2.nativeElement);
    }, 800);
  }

  carSub: any[] = [];
  getCarSub(car) {
    this._CarService.getCarSub(car).subscribe({
      next: (res) => (this.carSub = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // uploadProccess(event, element, status: string) {
  //   let uploadedFile: any[] = [];
  //   for (let file of event?.files) {
  //     uploadedFile.push(file);
  //   }

  //   if (status == "car_images") {
  //     this.ourCarsForm.patchValue({
  //       car_images: uploadedFile,
  //     });
  //     this.ourCarsForm.get("car_images").updateValueAndValidity();
  //   } else {
  //     this.ourCarsForm.patchValue({
  //       car_files: uploadedFile,
  //     });
  //   }

  //   this._ToastrService.setToaster(
  //     uploadedFile.length + " Files Uploaded Successfully",
  //     "info",
  //     "info"
  //   );

  //   setTimeout(() => {
  //     element.clear();
  //   }, 800);
  // }

  // ==========================================================================
  // Upload while edit car
  uploadModal1: boolean = false;
  uploadModal2: boolean = false;
  updateImage(imageId) {
    let input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    let base64: any = null;
    input.onchange = () => {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          if (e.target) {
            base64 = e.target;
          }
        };
        reader.readAsDataURL(input.files[0]);
        setTimeout(() => {
          this._OurCarService
            .updateImage({ image: base64?.result, file_id: imageId })
            .subscribe({
              next: (res) => {
                this.uploadModal1 = false;
                this.uploadModal2 = false;
                this.selectedRow.files.map((e) => {
                  if (e.id == res.data.id) e.image = res.data.image;
                });
              },
            });
        }, 1);
      }
    };
    input.click();
  }

  addNewImage(type: string) {
    let input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.click();
    input.onchange = () => {
      if (input.files && input.files[0]) {
        this.uploadDocuments(type, input.files);
      }
    };
  }

  uploadDocuments = async (type, files: FileList) => {
    let base64: any[] = [];
    const FILES = Array.from(files);
    const filePromises = FILES.map((file) => {
      // Return a promise per file
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const response = await base64.push(e.target.result);
            resolve(response);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    const fileInfos = await Promise.all(filePromises);

    setTimeout(() => {
      if (base64.length != 0) {
        // let img;
        // if (type == "document") {
        //   img = { car_files: base64, car_id: this.selectedRow.id };
        // } else {
        //   img = { car_images: base64, car_id: this.selectedRow.id };
        // }
        this._OurCarService
          .uploadImage({
            files: base64,
            car_id: this.selectedRow.id,
            type: type,
          })
          .subscribe({
            next: (res) => {
              this.selectedRow.files = res.data.files;
              this.uploadModal1 = false;
              this.uploadModal2 = false;
              this._ToastrService.setToaster(
                "Files Uploaded Successfully",
                "info",
                "info"
              );
            },
          });
      } else {
        this._ToastrService.setToaster(
          "Error Occurred While Uploading",
          "warning",
          "warning"
        );
      }
    }, 1);

    // return base64;
  };

  deleteImage(id) {
    this._OurCarService.deleteImage(id).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.selectedRow.files.map((img) => {
          if (img.id == id) {
            const index = this.selectedRow.files.indexOf(img);
            this.selectedRow.files.splice(index, 1);
          }
        });
        this.uploadModal1 = false;
        this.uploadModal2 = false;
      },
    });
  }

  // ==========================================================================
  // Upload while create car
  uploadTypes;
  uploadModal: boolean = false;
  uploadedFiles: any[] = [];
  currentUploadedType;
  displayUpload(type) {
    this.currentUploadedType = type;
    this.uploadModal = true;
  }

  uploadImage(event: any, uploadedImage) {
    let images = [];
    event.files.forEach((e) => {
      let reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = () => {
        images.push(reader.result);
        this.ourCarsForm.patchValue({
          files: images,
          type: this.currentUploadedType,
        });
        this.uploadModal = false;
        uploadedImage.files = [];
      };
    });
    this._ToastrService.setToaster(
      "File Uploaded Successfully",
      "info",
      "info"
    );
  }

  removeImage(removedImage, event) {
    let remainImages: any[] = [];
    event.files.forEach((e) => {
      if (e.name != removedImage.file.name) {
        remainImages.push(e);
      }
    });

    let images = [];
    remainImages.forEach((e) => {
      let reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = () => {
        images.push(reader.result);
        this.ourCarsForm.patchValue({
          files: null,
        });
      };
    });
  }
  // ==========================================================================

  contracts;
  getContracts(id) {
    this._OurCarService.getContracts(id).subscribe({
      next: (res) => {
        this.contracts = res.data;
      },
    });
  }
  // ==========================================================================
  // UPLOAD VIDEO

  uploadFile(car_id) {
    let input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.multiple = true;
    input.click();
    input.onchange = (e) => {
      if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = (event) => {
          // this.submitVideo(input.files[0], car_id);
          this.submitVideo((<FileReader>event.target).result, car_id);
        };
      }
    };
  }

  progress;
  videoInProgress: boolean = false;
  uploadedVideo;
  submitVideo(video, car_id) {
    this._OurCarService.uploadVideo(video, car_id).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type == 1) {
          this.progress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type == 3) {
          this.videoInProgress = true;
          this.progress = 0;
        } else if (event.type == 4) {
          this.videoInProgress = false;
          this._ToastrService.setToaster(
            event.body.message,
            "success",
            "success"
          );
          this.uploadedVideo = event.body.data;
        }
      },
      error: (err) => {
        this.videoInProgress = false;
        this.progress = 0;
        this._ToastrService.setToaster(
          "Couldn't upload video please check your internet connection and try again",
          "error",
          "danger"
        );
      },
    });
  }

  // ==========================================================================
  carVideos: any[] = [];
  getCarVideos(carId) {
    this._OurCarService.getVideosByCarId(carId).subscribe({
      next: (res) => {
        this.carVideos = res.data;
      },
    });
  }
  // ==========================================================================
  carMaintenance: any[] = [];
  currentMaintenanceCarId;

  displayCarMaintenance(id) {
    this.getCarMaintenanceById(id);
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show3.nativeElement);
    }, 800);
  }

  maintenanceType: any[] = [];
  getMaintenanceType() {
    this._CarMaintenanceService.getMaintenanceType().subscribe({
      next: (res) => {
        this.maintenanceType = res.data;
      },
    });
  }

  // displayAddMaintenance() {
  //   this.setMaintenanceForm2();
  //   this.maintenanceModal = true;
  // }

  @ViewChild("carMaintenanceTableBody")
  carMaintenanceTableBody: ElementRef<HTMLElement>;

  getCarMaintenanceById(car_id) {
    this.currentMaintenanceCarId = car_id;
    this._OurCarService.getCarMaintenanceById(car_id).subscribe({
      next: (res) => {
        this.carMaintenance = res.data;
        let inputs = this.getInputElements(this.carMaintenanceTableBody);
        this.clearInputValues(inputs);
        setTimeout(() => {
          this.setInputValues(inputs);
        }, 500);
      },
    });
  }

  // deleteCarMaintenance(id) {
  //   this._OurCarService.deleteCarMaintenance(id).subscribe({
  //     next: (res) => {
  //       this.carMaintenance = this.carMaintenance.filter((car) => car.id != id);
  //       this._ToastrService.setToaster(res.message, "success", "success");
  //     },
  //   });
  // }

  // maintenanceModal: boolean = false;
  // editMaintenanceModal: boolean = false;

  // addCarMaintenance(form) {
  //   this._OurCarService.addUpdateCarMaintenance(form.value).subscribe({
  //     next: (res) => {
  //       this.getCarMaintenanceById(this.currentMaintenanceCarId);
  //       this.maintenanceModal = false;
  //     },
  //   });
  // }

  // editCarMaintenance(form) {
  //   this._OurCarService.addUpdateCarMaintenance(form.value).subscribe({
  //     next: (res) => {
  //       this.carMaintenance.map((e) => {
  //         if (e.id == res.data.id) {
  //           Object.assign(e, res.data);
  //         }
  //       });
  //       this.editMaintenanceModal = false;
  //     },
  //   });
  // }

  // editMaintenanceForm(car) {
  //   this.maintenanceForm.controls.maintenance_type_id.disable();
  //   this.setMaintenanceForm(car);
  //   this.editMaintenanceModal = true;
  // }

  // ***************************************************************************

  AssignForm2: FormGroup = new FormGroup({});
  assignModal2: boolean = false;
  @ViewChild("AssignUsersForm2") AssignUsersForm2: HTMLFormElement;

  setAdminForm2(id?) {
    this.AssignForm2 = this._FormBuilder.group({
      user_ids: new FormArray([]),
      car_id: new FormControl(id),
    });
  }

  getAssignedUsers2(car) {
    this.resetAssignForm2();
    this.setAdminForm2(car.id);
    const usersId =
      this.AssignUsersForm2.nativeElement.querySelectorAll("input");
    const leadUsers = car.assign_user_ids;
    const formArray: FormArray = this.AssignForm2.get("user_ids") as FormArray;
    if (leadUsers) {
      this.assignModal2 = true;
      for (let i = 0; i < usersId.length; i++) {
        for (let j = 0; j < leadUsers.length; j++) {
          if (Number(usersId[i].value) == Number(leadUsers[j])) {
            if (!formArray.value.includes(leadUsers[j].toString())) {
              usersId[i].checked = true;
              formArray.push(new FormControl(usersId[i].value));
            }
          }
        }
      }
    }
  }

  assignUsers2(users: FormGroup) {
    this._OurCarService
      .assignUsers({
        car_id: users.value.car_id,
        user_ids: users.value.user_ids.filter(Number),
      })
      .subscribe({
        next: (res) => {
          if (res.status == 1) {
            this._ToastrService.setToaster(res.message, "success", "success");
            this.assignModal2 = false;
            this.ourCars.map((e) => {
              if (e.id == this.selectedRow.id) {
                e.assign_user_ids = users.value.user_ids.filter(Number);
              }
            });
          } else {
            this._ToastrService.setToaster(
              "Please select at least one user",
              "error",
              "danger"
            );
          }
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  // users: Array<any> = [];

  // getAdmins() {
  //   this._UsersService.getAdmins().subscribe({
  //     next: (res) => (this.users = res.data),
  //     error: (err) =>
  //       this._ToastrService.setToaster(err.error.message, "error", "danger"),
  //   });
  // }

  onCheckChange2(event) {
    const formArray: FormArray = this.AssignForm2.get("user_ids") as FormArray;
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

  resetAssignForm2() {
    this.AssignForm2.reset();
    this.AssignUsersForm2.nativeElement
      .querySelectorAll("input")
      .forEach((u) => (u.checked = false));
  }
  // ***************************************************************************

  updateCarMaintenance(
    // element: HTMLElement,
    updateBtn: HTMLButtonElement,
    ConfirmUpdate: HTMLButtonElement
  ) {
    updateBtn.classList.add("d-none");
    ConfirmUpdate.classList.remove("d-none");
    let inputs = this.getInputElements(this.carMaintenanceTableBody);
    inputs.forEach((inp: any) => {
      inp.forEach((e: HTMLInputElement) => {
        e.disabled = false;
      });
    });
  }

  confirmUpdate(
    // element: HTMLElement,
    updateBtn: HTMLButtonElement,
    ConfirmUpdate: HTMLButtonElement
  ) {
    updateBtn.classList.remove("d-none");
    ConfirmUpdate.classList.add("d-none");
    let inputs = this.getInputElements(this.carMaintenanceTableBody);
    let updatedMaintenances = [];
    inputs.forEach((inp: any) => {
      inp.forEach((e: HTMLInputElement) => {
        let holder: any = {};
        e.disabled = true;
        if (e.getAttribute("valueType") == "car_kilometer_out") {
          holder.car_kilometer_out = e.value;
        }
        if (e.getAttribute("valueType") == "kilometer_change_every") {
          holder.kilometer_change_every = e.value;
        }
        if (e.getAttribute("valueType") == "counter_last_time") {
          holder.counter_last_time = e.value;
        }
        holder.car_id = this.currentMaintenanceCarId;
        holder.maintenance_type_id = e.getAttribute("Maintenancetype");
        updatedMaintenances.push(holder);
      });
    });

    const mergeObj = (arr) => {
      return arr.reduce((acc, val, ind) => {
        const index = acc.findIndex(
          (el) => el.maintenance_type_id === val.maintenance_type_id
        );
        if (index !== -1) {
          const key = Object.keys(val)[2];
          const key0 = Object.keys(val)[0];
          const key1 = Object.keys(val)[1];
          acc[index][key] = val[key];
          acc[index][key0] = val[key0];
          acc[index][key1] = val[key1];
        } else {
          acc.push(val);
        }
        return acc;
      }, []);
    };

    updatedMaintenances = mergeObj(updatedMaintenances);
    const clean = (obj) => {
      for (var propName in obj) {
        if (
          obj[propName] === null ||
          obj[propName] === undefined ||
          obj[propName] === ""
        ) {
          delete obj["car_id"];
          delete obj["car_kilometer_out"];
          delete obj["counter_last_time"];
          delete obj["kilometer_change_every"];
          delete obj["maintenance_type_id"];
        }
      }
      return obj;
    };

    updatedMaintenances.forEach((element) => {
      clean(element);
      updatedMaintenances = updatedMaintenances.filter(
        (value) => Object.keys(value).length !== 0
      );
    });

    this._OurCarService.addUpdateCarMaintenance(updatedMaintenances).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this._ToastrService.setToaster(res.message, "success", "success"),
            this.getCarMaintenanceById(this.currentMaintenanceCarId);
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
    });
  }

  setInputValues(inputs) {
    inputs.forEach((inp: any) => {
      inp.forEach((e: HTMLInputElement) => {
        for (let i = 0; i < this.carMaintenance.length; i++) {
          if (
            e.getAttribute("valueType") == "car_kilometer_out" &&
            e.getAttribute("Maintenancetype") ==
              this.carMaintenance[i].maintenance_type_id
          ) {
            e.value = this.carMaintenance[i].car_kilometer_out;
          }
          if (
            e.getAttribute("valueType") == "kilometer_change_every" &&
            e.getAttribute("Maintenancetype") ==
              this.carMaintenance[i].maintenance_type_id
          ) {
            e.value = this.carMaintenance[i].kilometer_change_every;
          }
          if (
            e.getAttribute("valueType") == "counter_last_time" &&
            e.getAttribute("Maintenancetype") ==
              this.carMaintenance[i].maintenance_type_id
          ) {
            e.value = this.carMaintenance[i].counter_last_time;
          }
        }
      });
    });
  }

  clearInputValues(inputs) {
    inputs.forEach((inp: any) => {
      inp.forEach((e: HTMLInputElement) => {
        e.value = null;
      });
    });
  }

  getInputElements(element: ElementRef<HTMLElement>) {
    const LIST_OF_ROWS = Array.prototype.slice.call(
      element.nativeElement.children,
      0
    );
    let inputs: Node[] = [];
    LIST_OF_ROWS.forEach((row) => {
      inputs.push(row.querySelectorAll("input"));
    });
    return inputs;
  }
}
