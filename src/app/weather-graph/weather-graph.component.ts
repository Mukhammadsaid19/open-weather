// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import * as weatherDataOne from '../shared/services/sample_1';
import { Chart } from 'angular-highcharts';
import { WeatherService } from '../shared/services/weather.service';

@Component({
  selector: 'app-weather-graph',
  templateUrl: './weather-graph.component.html',
  styleUrls: ['./weather-graph.component.scss'],
})
export class WeatherGraphComponent implements OnInit {
  weatherOptions = null;
  latitude = 41.2995;
  longitude = 69.2401;
  apiKey = '307158891166aa7ddf6bbab5ced3ac67';

  timezone = null;
  dts = null;
  temperatures = null;
  uvi = null;

  isWeatherChart = false;
  weatherChart = new Chart();

  ngOnInit(): void {
    this.getWeatherData();
  }

  getWeatherData(): void {
    this.weatherService
      .getWeatherOptions(this.latitude, this.longitude, this.apiKey)
      .subscribe((weatherOptions) =>
        this.initializeWeatherOptions(weatherOptions)
      );
  }

  initializeWeatherOptions(weatherOptions) {
    this.weatherOptions = weatherOptions;
    this.timezone = this.weatherOptions['timezone'];
    this.dts = this.weatherOptions['hourly']
      .map(({ dt }) => dt)
      .map((date) => new Date(date * 1000));
    this.temperatures = this.weatherOptions['hourly'].map(({ temp }) => temp);
    this.uvi = this.weatherOptions['hourly'].map(({ uvi }) =>
      Number((uvi * 40).toFixed(3))
    );

    this.generateWeatherChart(
      this.timezone,
      this.dts,
      this.temperatures,
      this.uvi
    );
  }

  generateWeatherChart(
    timezone: string,
    dts: number[],
    temperatures: number[],
    uvi: number[]
  ) {
    this.isWeatherChart = true;
    this.weatherChart = new Chart({
      chart: {
        zoomType: 'xy',
      },
      time: {
        timezone: timezone,
      },
      title: {
        text: `${timezone} Weather Info`,
      },
      subtitle: {
        text: 'Source: OpenWeatherMap.org',
      },
      yAxis: [
        {
          title: {
            text: 'Temperature',
          },
          labels: {
            format: '{value} °K',
          },

          gridLineWidth: 1,
        },
        {
          title: {
            text: 'UVI Radiation',
          },
          labels: {
            format: '{value} W/m²',
          },
          opposite: true,
          gridLineWidth: 0,
        },
      ],

      xAxis: {
        type: 'datetime',
        gridLineWidth: 1,
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },

      series: [
        {
          yAxis: 0,
          name: 'Temperature',
          data: temperatures,
          pointStart: Date.UTC(
            dts[0].getFullYear(),
            dts[0].getMonth(),
            dts[0].getDay(),
            dts[0].getHours(),
            dts[0].getMinutes(),
            dts[0].getSeconds()
          ),
          pointInterval: 3600000,
          tooltip: {
            valueSuffix: ' K',
          },
        },

        {
          yAxis: 1,
          name: 'UVI',
          data: uvi,
          pointStart: Date.UTC(
            dts[0].getFullYear(),
            dts[0].getMonth(),
            dts[0].getDay(),
            dts[0].getHours(),
            dts[0].getMinutes(),
            dts[0].getSeconds()
          ),
          pointInterval: 3600000,
          tooltip: {
            valueSuffix: ' W/m²',
          },
        },
      ],
    });
  }

  constructor(private weatherService: WeatherService) {}
}
