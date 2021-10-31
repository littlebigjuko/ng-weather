import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { WeatherData } from './models/WeatherData';
import { WeatherService } from './weather.service';

export const LOCATIONS: string = 'locations';

interface Location {
  zipcode: string;
  code: string;
}

@Injectable()
export class LocationService {
  locations: Location[] = [];

  constructor(private weatherService: WeatherService) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) this.locations = JSON.parse(locString);
    for (let loc of this.locations) this.weatherService.addCurrentConditions(loc.zipcode, loc.code).subscribe();
  }

  addLocation(zipcode: string, code: string): Observable<WeatherData[]> {
    return this.weatherService.addCurrentConditions(zipcode, code).pipe(
      tap(() => {
        this.locations.push({ zipcode, code });
        localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      })
    );
  }

  removeLocation(zipcode: string) {
    let index = this.locations.findIndex((loc) => loc.zipcode === zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }
}
