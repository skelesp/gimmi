import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LeanStartupRespone, ReportingService } from '../../services/reporting.service';

@Component({
  selector: 'gimmi-lean-startup',
  templateUrl: './lean-startup.component.html',
  styleUrls: ['./lean-startup.component.css']
})
export class LeanStartupComponent implements OnInit {
  reportData: LeanStartupRespone;
  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = [];
  lineChartType = 'line';
  lineChartLegend = true;
  lineChartColors: Color[] = [];
  lineChartPlugins = [];
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

  constructor(
    private reportingService: ReportingService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.reportingService.getLeanStartupData().subscribe(response => {
      this.reportData = response;
      this.lineChartData = [
        {
          data: this.reportData.data[0],
          label: this.reportData.series[0],
          borderColor: "#97bbcd",
          pointBackgroundColor: "#97bbcd"
        }, {
          data: this.reportData.data[1],
          label: this.reportData.series[1],
          borderColor: '#9572f7',
          pointBackgroundColor: '#9572f7'
        }
      ];

      this.lineChartLabels = this.reportData.labels;

    }, error => {
      console.error(error);
      this.notificationService.showNotification(
        "De leanstartupgegevens konden niet opgehaald worden.",
        'error',
        'Probleem met data ophaling'
      );
    })
  }
}
