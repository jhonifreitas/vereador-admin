import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Inject, NgZone, ViewChild, ElementRef } from '@angular/core';

import { Temple } from 'src/app/models/temple';
import { Global } from 'src/app/models/global';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FBTempleService } from 'src/app/services/firebase/temple/temple.service';

declare var google: any;

@Component({
  selector: 'app-temple-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class TempleFormPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;

  private map: any;

  saving = false;
  form: FormGroup;
  localization: FormControl;
  geocoder = new google.maps.Geocoder();
  image: {path: string; new: boolean, file?: Blob;};
  googleAddress: {place_id: string; description: string;}[];
  googleAutocomplete = new google.maps.places.AutocompleteService();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Temple,
    private ngZone: NgZone,
    private global: Global,
    private utils: UtilsService,
    private formGroup: FormBuilder,
    private fbTemple: FBTempleService,
    private dialogRef: MatDialogRef<TempleFormPage>,
  ) {
    this.localization = new FormControl('');
    this.form = this.formGroup.group({
      complement: new FormControl(''),
      lat: new FormControl('', Validators.required),
      lng: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      zipcode: new FormControl('', [Validators.required, Validators.minLength(8)]),
    }, {validators: this.validatorform.bind(this)});
  }

  ngOnInit(): void {
    if(this.data){
      this.setData();
    }
  }

  setData() {
    if(this.data.image){
      this.image = {path: this.data.image, new: false};
    }
    this.form.get('lat').setValue(this.data.lat);
    this.form.get('lng').setValue(this.data.lng);
    this.form.get('name').setValue(this.data.name);
    this.form.get('city').setValue(this.data.city);
    this.form.get('state').setValue(this.data.state);
    this.form.get('number').setValue(this.data.number);
    this.form.get('address').setValue(this.data.address);
    this.form.get('zipcode').setValue(this.data.zipcode);
    this.form.get('district').setValue(this.data.district);
    this.form.get('complement').setValue(this.data.complement);
    this.loadMap();
  }

  loadMap() {
    const lat = this.form.get('lat').value;
    const lng = this.form.get('lng').value;

    if(lat && lng){
      setTimeout(() => {
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          center: {
            lat: lat,
            lng: lng
          },
          zoom: 14,
          ...this.global.map
        });

        new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(lat, lng),
          icon: {
            url: '/assets/icon/temple.svg',
            size: new google.maps.Size(30, 30),
          }
        });
      }, 500);
    }
  }

  validatorform(group: FormGroup) {
    const lat = group.get('lat');
    const lng = group.get('lat');
    let error = null;
    if(lat.invalid || lng.invalid){
      error = {invalid: true};
    }
    this.localization.setErrors(error);
    return {};
  }

  async takeImage(event: any) {
    const loader = this.utils.loading('Comprimindo imagem...');
    const reader = new FileReader();
    reader.addEventListener('load', async (event: any) => {
      let base64 = event.target.result as string;
      const compress = await this.utils.uploadCompress(base64);
      this.image = {path: compress.base64, file: compress.file, new: true};
      loader.componentInstance.done();
    });
    reader.readAsDataURL(event.addedFiles[0]);
  }

  async saveImage(id: string){
    if(this.image && this.image.new && this.image.file){
      await this.fbTemple.addImage(id, this.image.file);
    }
  }

  async deleteImage(){
    if(!this.image.new){
      this.utils.delete().then(async _ => {
        const path = this.image.path.split('/').pop().split('?')[0].replace(/%2F/g, '/').replace(/%20/g, ' ');
        await this.fbTemple.deleteImage(this.data.id, path);
        this.image = null;
      }).catch(_ => {})
    }else{
      this.image = null;
    }
  }

  filterPlace() {
    const filterValue = this.localization.value.toLowerCase();
    this.googleAddress = [];
    if(filterValue){
      const request = {
        input: filterValue,
        componentRestrictions: {country: ['br']},
        fields: ['formatted_address', 'geometry'],
      }
      this.googleAutocomplete.getPlacePredictions(request, (predictions: any[]) => {
        this.form.get('lat').setValue(null);
        this.form.get('lng').setValue(null);
        this.form.get('city').setValue(null);
        this.form.get('state').setValue(null);
        this.form.get('number').setValue(null);
        this.form.get('address').setValue(null);
        this.form.get('zipcode').setValue(null);
        this.form.get('district').setValue(null);
        this.form.get('complement').setValue(null);
        if(predictions){
          this.ngZone.run(_ => {
            this.googleAddress = predictions.map(prediction => {
              return {place_id: prediction.place_id, description: prediction.description}
            });
          })
        }
      });
    }
  }

  selectLocalization(place_id: string) {
    this.geocoder.geocode({ placeId: place_id }, (results: any[]) => {
      if(results.length){
        const place = results[0];
        this.ngZone.run(_ => {
          this.form.get('lat').setValue(place.geometry.location.lat());
          this.form.get('lng').setValue(place.geometry.location.lng());
          this.loadMap();
          place.address_components.forEach(address => {
            if(address.types.find(type => type == 'street_number')){
              this.form.get('number').setValue(address.long_name);
            }else if(address.types.find(type => type == 'route')) {
              this.form.get('address').setValue(address.long_name);
            }else if(address.types.find(type => type == 'sublocality')) {
              this.form.get('district').setValue(address.long_name);
            }else if(address.types.find(type => type == 'administrative_area_level_2')) {
              this.form.get('city').setValue(address.long_name);
            }else if(address.types.find(type => type == 'administrative_area_level_1')) {
              this.form.get('state').setValue(address.long_name);
            }else if(address.types.find(type => type == 'postal_code')) {
              this.form.get('zipcode').setValue(address.long_name);
            }
          });
        })
      }
    })
  }

  async save() {
    if(this.form.valid){
      this.saving = true;
      const data = this.form.value;
      for (const field in data) {
        if(!data[field]){data[field] = null}
      }

      if(this.data && this.data.id){
        await this.fbTemple.update(this.data.id, data);
        await this.saveImage(this.data.id);
      }else{
        await this.fbTemple.create(data).then(async doc => {
          await this.saveImage(doc.id);
        });
      }
      this.saving = false;
      this.utils.message('Templo salvo com sucesso!', 'success');
      this.dialogRef.close();
    }else{
      this.utils.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
