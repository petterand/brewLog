angular.module('app').controller('BrewsController', BrewsController);

BrewsController.$inject = ['$scope', 'BrewService', 'TempService', '$filter'];

function BrewsController($scope, BrewService, TempService, $filter) {

    $scope.newBrew = '';
    $scope.saving = false;

    function sortBrewsByStartDate(a, b) {
        return new Date(b.started_at) - new Date(a.started_at);
    }

    BrewService.getBrews().then(function (brews) {
        brews.sort(sortBrewsByStartDate);
        $scope.brews = brews;
        $scope.selectBrew(brews[0]); //should be the active brew
    });



    $scope.selectBrew = function selectBrew(brew) {
        $scope.selectedBrew = brew;
        getTempsForBrew(brew);
    };

    function getTempsForBrew(brew) {
        if (Boolean(brew.started_at)) {
            var fromDate = new Date(brew.started_at).getTime();
            var toDate = null;
            if (brew.ended_at) {
                toDate = new Date(brew.ended_at).getTime();
            }
            TempService.getTempsByDate(fromDate, toDate).then(function (temps) {
                $scope.selectedBrew.temps = temps;
                prepareChartData(temps);
            });
        }
    }

    $scope.deleteBrew = function deleteBrew(brew) {
        console.log('delete', brew);
    };

    $scope.saveBrew = function saveBrew() {
        var brewToSave = {
            name: $scope.newBrew
        };
        $scope.saving = true;
        BrewService.saveBrew(brewToSave).then(function () {
            $scope.brews.push(brewToSave)
            $scope.newBrew = '';
            $scope.saving = false;
        });
    }

    $scope.startBrew = function startBrew() {
        $scope.selectedBrew.started_at = new Date();
        BrewService.updateBrew($scope.selectedBrew).then(function (response) {
            var b = response.data;
            $scope.selectedBrew = b;
            $scope.selectedBrew.active = BrewService.isBrewActive($scope.selectedBrew);
        });
    }

    $scope.stopBrew = function startBrew() {
        $scope.selectedBrew.ended_at = new Date();
        BrewService.updateBrew($scope.selectedBrew).then(function (response) {
            var b = response.data;
            $scope.selectedBrew = b;
            $scope.selectedBrew.active = BrewService.isBrewActive($scope.selectedBrew);
            $scope.selectedBrew.ended = BrewService.isBrewEnded($scope.selectedBrew);
        });
    }

    function prepareChartData(temps) {
        var chartData = temps.map(function (item) {
            return parseFloat(item.temperature);
        });
        var chartLabels = temps.map(function (item) {
            return $filter('date')(item.measured_at, 'yyyy-MM-dd HH:mm');
        });


        $scope.chartData = [chartData];
        $scope.chartLabels = chartLabels;
        $scope.chartColors = ['#ff0000'];
        $scope.chartOptions = {
            tooltips: {
                mode: 'single',
                callbacks: {
                    title: function (a) {
                        return a[0].yLabel;
                    },
                    label: function () {
                        return '';
                    }
                }
            },
            elements: {
                line: {
                    fill: false,
                    borderColor: '#FF0000'
                },
                point: {
                    radius: 0
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };
    }

}