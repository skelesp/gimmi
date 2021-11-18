import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'gimmi-lean-startup',
  templateUrl: './lean-startup.component.html',
  styleUrls: ['./lean-startup.component.css']
})
export class LeanStartupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  lineChartData: ChartDataSets[] = [
    {
      data: [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 5, 7, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11], 
      label: 'Registered',
      borderColor: "#97bbcd",
      pointBackgroundColor: "#97bbcd"
    }, {
      data: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 5, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
      label: 'Activated',
      borderColor: '#9572f7',
      pointBackgroundColor: '#9572f7'
    }
  ];

  lineChartLabels: Label[] = ["2016/11", "2016/12", "2017/01", "2017/02", "2017/03", "2017/04", "2017/05", "2017/06", "2017/07", "2017/08", "2017/09", "2017/10", "2017/11", "2017/12", "2018/01", "2018/02", "2018/03", "2018/04", "2018/05", "2018/06", "2018/07", "2018/08", "2018/09", "2018/10", "2018/11", "2018/12", "2019/01", "2019/02", "2019/03", "2019/04", "2019/05", "2019/06", "2019/07", "2019/08", "2019/09", "2019/10", "2019/11", "2019/12", "2020/01", "2020/02", "2020/03", "2020/04", "2020/05", "2020/06", "2020/07", "2020/08", "2020/09", "2020/10", "2020/11", "2020/12", "2021/01", "2021/02", "2021/03", "2021/04", "2021/05", "2021/06", "2021/07", "2021/08", "2021/09", "2021/10", "2021/11**"];

  lineChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            beginAtZero: true,
            min: 0,
            suggestedMax: 20
          }
        }
      ]
    },
    elements: {
      line: {
        tension: 0,
        fill: false
      }
    },
    legend: {
      display: true,
      position: 'right'
    },
    title:
    {
      display: true,
      text: 'Lean startup dashboard',
      fontSize: 24
    }
  };

  lineChartColors: Color[] = [];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

}
