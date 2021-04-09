import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherUrl(latitude: number, longitude: number, api: string) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${api}`;
  }

  getWeatherOptions(latitude: number, longitude: number, api: string) {
    return this.http.get(this.getWeatherUrl(latitude, longitude, api));
  }
}
