import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LeanStartupRespone, ReportingService } from '../../services/reporting.service';

@Component({
  selector: 'gimmi-lean-startup',
  templateUrl: './lean-startup.component.html',
  styleUrls: ['./lean-startup.component.css']
})
export class LeanStartupComponent implements OnInit {
  reportData: LeanStartupRespone;
  lineChartType = 'line';
  lineChartLegend = true;
  lineChartData: ChartConfiguration['data'];
  lineChartOptions : ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        min: 0,
        suggestedMax: 100,
        ticks: {
           stepSize: 10
        }
      }
    },
    elements: {
      line: {
        tension: 0,
        fill: false
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'right'
      },
      title:
      {
        display: true,
        text: 'Lean startup dashboard',
        font: {
          size: 24
        }
      }
    }
  };

  constructor(
    private reportingService: ReportingService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.reportingService.getLeanStartupData().subscribe(response => {
      this.reportData = response;
      console.info(this.reportData);
      this.lineChartData = {
        datasets: [
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
      ],
      labels: this.reportData.labels};

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
