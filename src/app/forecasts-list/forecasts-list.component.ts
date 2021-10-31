import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export class ForecastsListComponent {
  code: string;
  zipcode: string;
  forecast: any;

  constructor(private weatherService: WeatherService, route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.zipcode = params['zipcode'];
      this.code = params['code'];
      weatherService.getForecast(this.zipcode, this.code).subscribe((data) => (this.forecast = data));
    });
  }
}
