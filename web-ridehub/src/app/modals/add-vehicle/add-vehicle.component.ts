import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from 'src/app/interfaces/vehicles/vehicle';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { VehiclesService } from 'src/app/services/vehicles/get-vehicle.service';
import { verifyLicense } from 'src/app/namespaces/license-plate-verifier';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {

  constructor(
    private _vehicles: VehiclesService,
    private userData: UserDataService,
    public componentToggler: ComponentTogglerService

  ) { }

  vehicles: Vehicle[];
  alertStatus: AlertModal; 

  ngOnInit(): void {
    this._vehicles.getVehicle(this.userData.user.id_utilizador).subscribe(
      data => {
        console.log(data);
        this.vehicles = data;
      },
      error => console.log(error)
    )
  }
  
  createCar(createVehicle): void {
    if(!verifyLicense.licenseValidator.isValid(createVehicle.form.value.matricula)){
      this.alertStatus = { success: false, message: 'Verify your inputs!' }
      this.componentToggler.alertModal = true;
      return;
    }

    let data = createVehicle.form.value;
    data.id_utilizador = this.userData.user.id_utilizador;
    
    this._vehicles.createVehicle(data).subscribe(
      data =>{
        this.alertStatus = { success: true, message: 'A new car was added!' }
        this.componentToggler.alertModal = true;
        this.closeButton();
      }, 
      error => {
        this.alertStatus = { success: true, message: 'An error occurred!!' }
        this.componentToggler.alertModal = true;
      }
    )
  }

  deleteVehicle(removeVehicle): void{
    this._vehicles.deleteVehicle(removeVehicle.form.value.id_viatura).subscribe(
      data => {
        this.alertStatus = { success: true, message: 'Car was deleted with success!' }
        this.componentToggler.alertModal = true;
        this.closeButton();
      },
      error => {
        this.alertStatus = { success: true, message: 'An error occurred!!' }
        this.componentToggler.alertModal = true;
      }, 
    )
  }

  @ViewChild('vehicle_wrapper') container: ElementRef;
  closeButton(): void {
    this.container.nativeElement.classList.remove('slide-in-bottom');
    this.container.nativeElement.classList.add('slide-out-bottom');
   
    setTimeout(() => {
      this.componentToggler.addVehicle = false;
    }, 4500);
  }
}
