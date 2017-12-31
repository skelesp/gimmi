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
    .controller('leanstartupCtrl', [function () {
    var _self = this;

    _self.labels = ['2016/11', '2016/12', '2017/01', '2017/02', '2017/03', '2017/04', '2017/05', '2017/06', '2017/07', '2017/08', '2017/09', '2017/10', '2017/11', '2017/12'];
    _self.series = ['Registered', 'Activated'];
    _self.data = [
        [65, 59, 80, 81, 56, 55, 40]
    ];
    _self.onHover = function (points) {
        if (points.length > 0) {
            console.log('Point', points[0].value);
        } else {
            console.log('No point');
        }
    };
    _self.datasetOverride = [{ yAxisID: 'y-axis-1' }];

    _self.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
}]);