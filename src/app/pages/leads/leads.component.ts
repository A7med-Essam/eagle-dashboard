import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarPriceService } from "app/shared/services/car-price.service";
import { CarService } from "app/shared/services/car.service";
import { GuardService } from "app/shared/services/guard.service";
import { InsuranceAndPolicyService } from "app/shared/services/insurance-and-policy.service";
import { LeadsService } from "app/shared/services/leads.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { UsersService } from "app/shared/services/users.service";
import { ConfirmationService } from "primeng/api";
import { Calendar } from "primeng/calendar";
import { FileUpload } from "primeng/fileupload";

@Component({
  selector: "leads-cmp",
  moduleId: module.id,
  templateUrl: "leads.component.html",
  providers: [ConfirmationService],
})
export class LeadsComponent implements OnInit {
  pagination: any;
  pagination2: any;
  leads: any[] = [];
  insurance: any[] = [];
  grade: any[] = [];
  gearType: any[] = [];
  driverStatus: any[] = [];
  carModel: any[] = [];
  carType: any[] = [];
  carName: any[] = [];
  carColor: any[] = [];
  allReplies: any[] = [];
  insuranceCompanies: any[] = [];
  policies: any[] = [];
  selectedGrade: any;
  selectedCarModel: any;
  selectedGearType: any;
  selectedInsurance: any;
  selectedInsuranceCompany: any;
  selectedPolicy: any;
  currentLead: any;
  currentEditRow: any;

  filterModal: boolean = false;
  addCarNameModal: boolean = false;
  addCarColorModal: boolean = false;
  addCarTypeModal: boolean = false;
  allRepliesModal: boolean = false;
  addReplayModal: boolean = false;
  clientInsuranceCompanyModal: boolean = false;
  assignModal: boolean = false;

  @ViewChild("LeadsTable") LeadsTable: any;
  @ViewChild("Leads2") Leads2: any;
  @ViewChild("ShowLead") ShowLead: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;
  @ViewChild("AssignUsersForm") AssignUsersForm: HTMLFormElement;

  leadForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});
  AssignForm: FormGroup = new FormGroup({});

  users: Array<any> = [];

  constructor(
    private _LeadsService: LeadsService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _CarService: CarService,
    private _UsersService: UsersService,
    private _ConfirmationService: ConfirmationService,
    private _InsuranceAndPolicyService: InsuranceAndPolicyService,
    private _GuardService: GuardService,
    private _CarPriceService: CarPriceService,
    private _FormBuilder: FormBuilder
  ) {
    this.driverStatus = [
      { name: "YES", value: "yes" },
      { name: "NO", value: "no" },
    ];
    this.gearType = [
      { name: "Automatic", value: "AUTOMATIC" },
      { name: "Manual", value: "MANUAL" },
    ];

    const currentYear = new Date().getFullYear() + 1;
    for (let i = 2015; i <= currentYear; i++) {
      this.carModel.push({ name: `Model ${i}`, value: `${i}` });
    }
    this.selectedGrade = this.grade[0];
    this.selectedInsurance = this.insurance[0];
    this.selectedInsuranceCompany = this.insuranceCompanies[0];
    this.selectedCarModel = this.carModel[0];
    this.selectedGearType = this.gearType[0];
  }

  ngOnInit() {
    this.getAllLeads();
    this.setLeadForm();
    this.setFilterForm();
    this.getCarName();
    this.getCarColor();
    this.getCarType();
    this.getGrade();
    this.getInsurance();
    this.getAdmins();
    this.setAdminForm();
    this.getInsuranceCompanies();
    this.setPermissions();
  }

  // Leads Settings
  getAllLeads(page = 1) {
    this._LeadsService.getLeads(page).subscribe({
      next: (res) => {
        this.leads = res.data.data;
        this.pagination = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  loadPage(page: number) {
    this.getAllLeads(page);
  }

  resetFilter() {
    this.getAllLeads();
    this.filterStatus = false;
    this.setFilterForm();
  }

  getLeadById(id: any) {
    [this.currentLead] = this.leads.filter((lead) => lead.id == id);
    this.displayLeadDetails();
    this._LeadsService.getLeadsById(id).subscribe({
      next: (res) => {
        this.currentLead = res.data;
      },
    });
  }

  displayLeadDetails() {
    this._SharedService.fadeOut(this.LeadsTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.ShowLead.nativeElement);
    }, 800);
  }

  deleteLead(id: any) {
    this._LeadsService.deleteLeads(id).subscribe({
      next: (res) => {
        // this.getAllLeads();
        this.leads = this.leads.filter((data) => data.id != id);

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  createLead(form: any) {
    if (form.value.insuranceCompany) {
      form.controls["insurance_in_out"].setValue("in");
    } else {
      form.controls["insurance_in_out"].setValue("out");
    }

    if (this.currentClientInsuranceCompany) {
      form.controls["company_policy_id"].setValue(
        this.currentClientInsuranceCompany.id
      );
      form.addControl(
        "company_policy_not_exists",
        new FormControl(this.currentClientInsurancePolicy)
      );
    }
    delete this.leadForm.value.insuranceCompany;

    this._LeadsService.createLeads(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getAllLeads();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          this.fadeInLeadsTable();
          this.currentClientInsuranceCompany = null;
          // Assign clear form
          this.AssignForm.reset(this.AssignForm.value);
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  addLead() {
    this.setLeadForm();
    this._SharedService.fadeOut(this.LeadsTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.CreateForm.nativeElement);
    }, 800);
  }

  editLead(lead: any) {
    let [car] = this.carName.filter((c) => c.value == lead.car_name);
    this.getCarSub(car?.id);
    // this.getCarSub(lead?.car_type_details?.car_name_id);
    this._SharedService.fadeOut(this.LeadsTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.EditForm.nativeElement);
    }, 800);
    this.setLeadForm(lead);
    this.currentEditRow = lead;
  }

  updateLead(form: any) {
    this.leadForm.addControl(
      "lead_id",
      new FormControl(this.currentEditRow.id, Validators.required)
    );

    if (form.value.insuranceCompany) {
      form.controls["insurance_in_out"].setValue("in");
    } else {
      form.controls["insurance_in_out"].setValue("out");
    }

    if (this.currentClientInsuranceCompany) {
      form.controls["company_policy_id"].setValue(
        this.currentClientInsuranceCompany.id
      );
      form.addControl(
        "company_policy_not_exists",
        new FormControl(this.currentClientInsurancePolicy)
      );
    }
    delete this.leadForm.value.insuranceCompany;

    this._LeadsService.updateLeads(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.leads.map((lead) => {
            if (lead.id == res.data.id) {
              Object.assign(lead, res.data);
            }
          });
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.EditForm.nativeElement);
          this.fadeInLeadsTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  filterStatus = false;
  filterLeads(form: any) {
    if (!form.value.issue_date) delete form.value.issue_date;
    else {
      form.patchValue({
        issue_date: form.value.issue_date
          .toLocaleString("en-us", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"),
      });
    }
    if (!form.value.customer_name) delete form.value.customer_name;
    if (!form.value.customer_mobile) delete form.value.customer_mobile;
    if (!form.value.car_name) delete form.value.car_name;
    if (!form.value.car_color) delete form.value.car_color;
    if (!form.value.car_type) delete form.value.car_type;
    if (!form.value.gear_type) delete form.value.gear_type;
    if (!form.value.car_model) delete form.value.car_model;
    if (!form.value.grade) delete form.value.grade;
    if (!form.value.kilometer) delete form.value.kilometer;
    if (!form.value.insurance) delete form.value.insurance;
    if (!form.value.car_subtype_id) delete form.value.car_subtype_id;
    if (!form.value.created_id) delete form.value.created_id;
    if (!form.value.assigned_id) delete form.value.assigned_id;
    form.value.withoutPagination = 0;
    this._LeadsService.filterLeads(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        // this.leads = res.data.data;
        this.leads = res.data;
        // this.pagination = res.data;
        this.pagination = null;
        // this.currentFilter = form.value;
        this.filterStatus = true;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  exportLeads() {
    this._LeadsService.exportLeads().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  exportLeadsWithFilter() {
    let filteredRows = [];
    this.leads.forEach((e) => {
      filteredRows.push(e.id);
    });
    this._LeadsService
      .exportLeadsWithFilter({ leadIds: filteredRows })
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

  getAllReplies(id: number) {
    this._LeadsService.getRepliesByLeadsId(id).subscribe({
      next: (res) => {
        this.allReplies = res.data;
        this.allRepliesModal = true;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getAssignedUsers() {
    this.resetAssignForm();
    const usersId =
      this.AssignUsersForm.nativeElement.querySelectorAll("input");
    const leadUsers = this.currentLead.lead_users;
    const formArray: FormArray = this.AssignForm.get("user_ids") as FormArray;
    if (leadUsers) {
      this.assignModal = true;
      for (let i = 0; i < usersId.length; i++) {
        for (let j = 0; j < leadUsers.length; j++) {
          if (Number(usersId[i].value) == leadUsers[j].user_id) {
            if (!formArray.value.includes(leadUsers[j].user_id.toString())) {
              usersId[i].checked = true;
              formArray.push(new FormControl(usersId[i].value));
            }
          }
        }
      }
    }
  }

  resetAssignForm() {
    this.AssignForm.reset();
    this.AssignUsersForm.nativeElement
      .querySelectorAll("input")
      .forEach((u) => (u.checked = false));
  }

  addReplay(replay: HTMLTextAreaElement) {
    this._LeadsService
      .replayLeads({ lead_id: this.currentLead.id, replay: replay.value })
      .subscribe({
        next: (res) => {
          this.addReplayModal = false;
          this._ToastrService.setToaster(res.message, "success", "success");
          replay.value = "";
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  assignUsers(users: FormGroup) {
    this._LeadsService
      .assignUsers({
        lead_id: this.currentLead.id,
        user_ids: users.value.user_ids.filter(Number),
      })
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.assignModal = false;
          this.getLeadById(this.currentLead.id);
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

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

  deleteConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteLead(id);
      },
    });
  }

  // Set Reactive Forms
  setLeadForm(lead?: any) {
    let km = null;
    if (lead?.km) {
      km = Number(lead.kilometer.slice(0, -1));
    }
    this.leadForm = this._FormBuilder.group({
      customer_name: new FormControl(lead?.customer_name),
      customer_mobile: new FormControl(lead?.customer_mobile),
      car_name: new FormControl(lead?.car_name),
      car_color: new FormControl(lead?.car_color),
      car_type: new FormControl(lead?.car_type),
      gear_type: new FormControl(lead?.gear_type),
      car_model: new FormControl(lead?.car_model),
      grade: new FormControl(lead?.grade),
      kilometer: new FormControl(km),
      driver: new FormControl(lead?.driver),
      insurance: new FormControl(lead?.insurance),
      car_subtype_id: new FormControl(lead?.car_type_details?.id),
      insurance_in_out: new FormControl(lead?.insurance_in_out),
      company_policy_id: new FormControl(lead?.company_policy_id),
      insuranceCompany: new FormControl(lead?.insuranceCompany),
    });
  }

  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      customer_name: new FormControl(null),
      customer_mobile: new FormControl(null),
      car_name: new FormControl(null),
      car_color: new FormControl(null),
      car_type: new FormControl(null),
      gear_type: new FormControl(null),
      car_model: new FormControl(null),
      grade: new FormControl(null),
      kilometer: new FormControl(null),
      insurance: new FormControl(null),
      issue_date: new FormControl(null),
      car_subtype_id: new FormControl(null),
      created_id: new FormControl(null),
      assigned_id: new FormControl(null),
    });
  }

  setAdminForm() {
    this.AssignForm = this._FormBuilder.group({
      user_ids: new FormArray([]),
    });
  }

  // Car Settings
  getCarName() {
    // this.carName = [{ name: "Select Car Name", value: "" }];
    this._CarService.getCarName().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carName.push({ name: e.car_name, value: e.car_name, id: e.id });
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

  // addCarName(car: HTMLInputElement) {
  //   this._CarService.createCarName(car.value).subscribe({
  //     next: (res) => {
  //       this.getCarName();
  //       this.addCarNameModal = false;
  //     },
  //     error: (err) =>
  //       this._ToastrService.setToaster(err.error.message, "error", "danger"),
  //   });
  // }

  carSub: any[] = [];
  getCarSub(car) {
    this._CarService.getCarSub(car).subscribe({
      next: (res) => (this.carSub = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // addCarColor(car: HTMLInputElement) {
  //   this._CarService.createCarColor(car.value).subscribe({
  //     next: (res) => {
  //       this.getCarColor();
  //       this.addCarColorModal = false;
  //     },
  //     error: (err) =>
  //       this._ToastrService.setToaster(err.error.message, "error", "danger"),
  //   });
  // }

  // addCarType(car: HTMLInputElement) {
  //   this._CarService.createCarType(car.value).subscribe({
  //     next: (res) => {
  //       this.getCarType();
  //       this.addCarTypeModal = false;
  //     },
  //     error: (err) =>
  //       this._ToastrService.setToaster(err.error.message, "error", "danger"),
  //   });
  // }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.ShowLead.nativeElement);
    this.fadeInLeadsTable();
  }

  backDetailsBtn2() {
    this._SharedService.fadeOut(this.Leads2.nativeElement);
    this.fadeInLeadsTable();
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.CreateForm.nativeElement);
    this.fadeInLeadsTable();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.EditForm.nativeElement);
    this.fadeInLeadsTable();
  }

  fadeInLeadsTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.LeadsTable.nativeElement);
    }, 800);
  }

  // Insurance Company - Policy
  getInsuranceCompanies() {
    this.insuranceCompanies = [];
    this._InsuranceAndPolicyService.getInsuranceCompanies().subscribe({
      next: (res) => {
        // res.data.forEach((e: any) => {
        //   this.insuranceCompanies.push(...res.data);
        // });
        this.insuranceCompanies = res.data;
      },
    });
  }

  onCompanyChange(e) {
    this.policies = [];
    e.value.forEach((e: any) => {
      this.policies.push({ name: e.policy.type, value: e.id });
    });
  }

  currentClientInsuranceCompany: any;
  currentClientInsurancePolicy: any;
  addClientInsuranceCompany(
    company: HTMLInputElement,
    policy: HTMLInputElement
  ) {
    this._InsuranceAndPolicyService
      .addClientInsuranceCompany({
        name: company.value,
        company_policy_not_exists: policy.value,
      })
      .subscribe({
        next: (res) => {
          this.clientInsuranceCompanyModal = false;
          this.currentClientInsuranceCompany = res.data;
          this.currentClientInsurancePolicy = policy.value;
          company.value = null;
          policy.value = null;
          this._ToastrService.setToaster(res.message, "success", "success");
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  // Permissions
  read: boolean = false;
  create: boolean = false;
  update: boolean = false;
  delete: boolean = false;
  makeReplay: boolean = false;
  seeReplay: boolean = false;
  isSuperAdmin: boolean = false;
  setPermissions() {
    this.read = this._GuardService.hasLeadsPermission_Read();
    this.create = this._GuardService.hasLeadsPermission_Create();
    this.update = this._GuardService.hasLeadsPermission_Update();
    this.delete = this._GuardService.hasLeadsPermission_Delete();
    this.makeReplay = this._GuardService.hasLeadsPermission_MakeReplay();
    this.seeReplay = this._GuardService.hasLeadsPermission_SeeReplay();
    this.isSuperAdmin = this._GuardService.isSuperAdmin();

    // if (this._GuardService.isSuperAdmin()) {
    //   this.read = true;
    //   this.create = true;
    //   this.update = true;
    //   this.delete = true;
    //   this.makeReplay = true;
    //   this.seeReplay = true;
    // }
  }

  onChange(event) {
    if (
      this.leadForm.value.car_name &&
      this.leadForm.value.grade &&
      this.leadForm.value.car_model &&
      this.leadForm.value.gear_type &&
      this.leadForm.value.kilometer
    ) {
      const car = {
        car_name: this.leadForm.value.car_name,
        car_model: this.leadForm.value.car_model,
        car_grade: this.leadForm.value.grade,
        car_gear: this.leadForm.value.gear_type,
      };
      this._CarPriceService.filterCarPrice(car).subscribe({
        next: (res) => {
          let message: string = "";
          if (this.leadForm.value.kilometer <= "50000") {
            message = `<small>Car Price ${res.data.data[0].zero_min}</small> `;
          } else if (
            this.leadForm.value.kilometer <= "100000" &&
            this.leadForm.value.kilometer > "50000"
          ) {
            message = `<small>Car Price ${res.data.data[0].bad_min}</small> `;
          } else if (this.leadForm.value.kilometer > "100000") {
            message = `<small>Car Price ${res.data.data[0].good_min}</small> `;
          }
          this._ToastrService.setToaster(message, "info", "primary");
        },
      });
    }
  }

  addReminder: boolean = false;
  minimumDate = new Date();

  reminderNotice:string = ""
  getReminderNotice(note){
    this.reminderNotice = note.value;
    note.value = ""
  }

  addReminderLead(calendar: Calendar) {
    setTimeout(() => {
      if (calendar.inputFieldValue != "") {
        const lead = {
          remind_data:this.reminderNotice,
          lead_id: this.currentLead.id,
          remind_date: new Date(calendar.inputFieldValue).toLocaleDateString(
            "en-CA"
          ),
          reminded: 0,
          add: true,
        };
        this._LeadsService.addReminderLead(lead).subscribe({
          next: (res) => {
            if (res.status == 1) {
              this._SharedService;
              this._ToastrService.setToaster(res.message, "success", "success");
              this.addReminder = false;
              calendar.clear();
            } else {
              this._ToastrService.setToaster(res.message, "error", "danger");
            }
          },
        });
      } else {
        this._ToastrService.setToaster(
          "Error Occurred. Please try again",
          "error",
          "danger"
        );
      }
    }, 1);
  }

  downloadSample() {
    this._LeadsService.downloadSample().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
    });
  }

  importModal: boolean = false;
  displayImportLeadsModal() {
    this.importModal = true;
  }

  importLeads(e: FileUpload) {
    let reader = new FileReader();
    reader.readAsDataURL(e._files[0]);
    reader.onload = () => {
      let formData = new FormData();
      for (let i = 0; i < e._files.length; i++) {
        formData.append("file", e._files[i], e._files[i]["name"]);
      }
      this._LeadsService.importLeads(formData).subscribe({
        next: (res) => {
          this.importModal = false;
          this._ToastrService.setToaster(res.message, "success", "success");
          e._files = null;
          this.getAllLeads();
        },
      });
    };
  }

  optionsModal:boolean = false;
  displayLeadsWithoutAssign(){
    this.getLeadsWithoutAssign();
    this._SharedService.fadeOut(this.LeadsTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Leads2.nativeElement);
    }, 800);
  }
  
  leadsWithoutAssign:any;
  getLeadsWithoutAssign(page = 1){
    this._LeadsService.getLeadsWithoutAssign(page).subscribe({
      next:res=>{
        this.leadsWithoutAssign = res.data.data;
        this.pagination2 = res.data
      }
    })
  }

  loadPage2(page: number) {
    this.selectedLeadsToAssign = [];
    this.getLeadsWithoutAssign(page);
  }

  assignAllModal:boolean = false;

  selectedLeadsToAssign:any[] = []
  assignNewLeads(e){
    const leadsIds = this.selectedLeadsToAssign.map((value) => {
      return value.id;
    });
    this._LeadsService
    .AssignLeads({
      lead_ids: leadsIds,
      user_id: e,
    })
    .subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.assignAllModal = false;
        this.getLeadsWithoutAssign();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }
}
