import { Component } from '@angular/core';
import { COUNTRY_LIST, CountryData } from 'app/models/CountryList';

import { LocationService } from '../location.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
})
export class ZipcodeEntryComponent {
  zipcode: string = '';
  country: CountryData;
  countryList = COUNTRY_LIST;

  constructor(public service: LocationService) {}

  addLocation() {
    return this.service.addLocation(this.zipcode, this.country?.code);
  }
}
