import { Component, OnInit } from '@angular/core';
import { ApiService, AlertService } from 'src/app/shared';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public addressArray: any = [];
  name = 'Angular 8 reactive form with dynamic fields and validations example';
  exampleForm: FormGroup;
  totalSum: number = 0;
  myFormValueChanges$;
  constructor(private Api : ApiService,private toast:ToastrService ,private alertService:AlertService,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getdaddrees();

    this.exampleForm = this.formBuilder.group({
      // companyName: ['', [Validators.required,Validators.maxLength(25)]],
      // countryName: [''],
      // city: [''],
      // zipCode: [''],
      // street: [''],
      units: this.formBuilder.array([
         // load first row at start
         this.getUnit()
      ])
    });      
  }
  public getdaddrees() {
    this.Api.getAddress().then(res=>{
      this.addressArray = [res.message];
      console.log("Addresss")
      console.log( this.addressArray );
    })
  }
 
  getZkaddres(addr)
  {
      console.log(addr)
      this.Api.getAddressAll(addr).then(res=>{
      console.log(res.data);

  })
  }

 /**
   * unsubscribe listener
   */
  ngOnDestroy(): void {
    this.myFormValueChanges$.unsubscribe();
  }

  /**
   * Save form data
   */
  save(model: any, isValid: boolean, e: any) {
    e.preventDefault();
    alert('Form data are: ' + JSON.stringify(model));
  }

  /**
   * Create form unit
   */
  private getUnit() {
    const numberPatern = '^[0-9.,]+$';
    return this.formBuilder.group({
      unitName: ['', Validators.required],
      qty: [1, [Validators.required, Validators.pattern(numberPatern)]],
      unitPrice: ['', [Validators.required, Validators.pattern(numberPatern)]],
      unitTotalPrice: [{value: '', disabled: true}]
    });
  }

  /**
   * Add new unit row into form
   */
  addUnit() {
    const control = <FormArray>this.exampleForm.controls['units'];
    control.push(this.getUnit());
  }

  /**
   * Remove unit row from form on click delete button
   */
  removeUnit(i: number) {
    const control = <FormArray>this.exampleForm.controls['units'];
    control.removeAt(i);
  }

  /**
   * This is one of the way how clear units fields.
   */
  clearAllUnits() {
    const control = <FormArray>this.exampleForm.controls['units'];
    while(control.length) {
      control.removeAt(control.length - 1);
    }
    control.clearValidators();
    control.push(this.getUnit());
  }

}
