/* For all configuration options see:
Angular module : http://jtblin.github.io/angular-chart.js/ 
ChartJS library: http://www.chartjs.org/docs/latest/ */

angular.module('gimmi.reporting', [
    'chart.js',
    'gimmi.config'
])
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('gimmi.reporting', {
            url: 'reporting',
            views: {
                'content@': {
                    templateUrl: 'app/reporting/reporting.tmpl.html',
                    controller: 'reportingCtrl as reporting',
                }
            },
            authenticate: true
        })
})
.controller('reportingCtrl', [function(){

}])
.controller('leanstartupCtrl', ['$http', 'CONFIG', function ($http, CONFIG) {
var _self = this;

$http.get(CONFIG.apiUrl + '/api/reporting/leanstartup').success(function(reportData){
    _self.data = reportData.data;
    _self.labels = reportData.labels;
    _self.series = reportData.series;
})
_self.onHover = function (points) {
    if (points.length > 0) {
        console.log('Point', points[0].value);
    } else {
        console.log('No point');
    }
};
_self.datasetOverride = [
    //dataset 1: registration
    { 
        yAxisID: 'y-axis-1'
    },
    //dataset 2: activation
    { 
        yAxisID: 'y-axis-1',
        borderColor: '#9572f7',
        pointBackgroundColor: '#9572f7'
    }
];

_self.options = {
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
}]);