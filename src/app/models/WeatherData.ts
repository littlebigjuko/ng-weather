import { Observable } from 'rxjs';

export interface WeatherData {
  zip: string;
  code: string;
  data: any;
  request: Observable<WeatherData[]>;
}
