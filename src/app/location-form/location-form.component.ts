import { Component } from '@angular/core';
import { COUNTRY_LIST, CountryData } from 'app/models/CountryList';

import { LocationService } from '../location.service';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
})
export class LocationFormComponent {
  zipcode: string = '';
  country: CountryData;
  countryList = COUNTRY_LIST;

  constructor(public service: LocationService) {}

  addLocation() {
    return this.service.addLocation(this.zipcode, this.country?.code || '');
  }
}
