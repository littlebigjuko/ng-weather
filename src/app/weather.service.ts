import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, timer, zip } from 'rxjs';
import { delay, filter, map, switchMap, tap } from 'rxjs/operators';

import { environment } from './../environments/environment';
import { WeatherData } from './models/WeatherData';

export const PERIOD: number = 30000;
export const DUE_TIME: number = PERIOD;
export const UX_NOTIFICATION_DELAY: number = 3000;

@Injectable()
export class WeatherService {
  static URL = environment.weatherUrl;
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions: WeatherData[] = [];
  refreshing = false;

  constructor(private http: HttpClient) {
    timer(DUE_TIME, PERIOD)
      .pipe(
        filter(() => this.currentConditions.length > 0),
        tap(() => {
          this.refreshing = true;
        }),
        switchMap(() => {
          const requests = [];
          for (let i in this.currentConditions) requests.push(this.currentConditions[i].request);
          return combineLatest(requests);
        }),
        delay(UX_NOTIFICATION_DELAY)
      )
      .subscribe(() => (this.refreshing = false));
  }

  addCurrentConditions(zipcode: string, code: string): Observable<WeatherData[]> {
    // Here we make a request to get the curretn conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    const request = this.http
      .get(`${WeatherService.URL}/weather?zip=${zipcode},${code}&units=imperial&APPID=${WeatherService.APPID}`)
      .pipe(
        map((data) => {
          const currentZipCodeIndex = this.currentConditions.findIndex((conditions) => conditions.zip === zipcode);
          if (currentZipCodeIndex >= 0) {
            this.currentConditions[currentZipCodeIndex] = { zip: zipcode, code, data: data, request };
          } else {
            this.currentConditions.push({ zip: zipcode, code, data: data, request });
          }
          return this.currentConditions;
        })
      );
    return request;
  }

  removeCurrentConditions(zipcode: string) {
    for (let i in this.currentConditions) {
      if (this.currentConditions[i].zip == zipcode) this.currentConditions.splice(+i, 1);
    }
  }

  getCurrentConditions(): any[] {
    return this.currentConditions;
  }

  getForecast(zipcode: string, code: string): Observable<any> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},${code}&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  getWeatherIcon(id) {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }
}
