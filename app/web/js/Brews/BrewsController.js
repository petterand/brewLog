angular.module('app').controller('BrewsController', BrewsController);

BrewsController.$inject = ['$scope', 'BrewService', 'TempService'];

function BrewsController($scope, BrewService, TempService) {

    $scope.newBrew = '';
    $scope.saving = false;

    BrewService.getBrews().then(function(brews) {
        $scope.brews = brews;
        $scope.selectBrew(brews[0]); //should be the active brew
    });

    $scope.selectBrew = function selectBrew(brew) {
        $scope.selectedBrew = brew;
        getTempsForBrew(brew);
    };

    function getTempsForBrew(brew) {
        if(Boolean(brew.started_at)) {
            var fromDate = new Date(brew.started_at).getTime();
            var toDate = null;
            if(brew.ended_at) {
                toDate = new Date(brew.ended_at).getTime();
            }
            TempService.getTempsByDate(fromDate, toDate).then(function(temps) {
                $scope.selectedBrew.temps = temps;
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
        BrewService.saveBrew(brewToSave).then(function() {
            $scope.brews.push(brewToSave)
            $scope.newBrew = '';
            $scope.saving = false;
        });
    }

    $scope.startBrew = function startBrew() {
        $scope.selectedBrew.started_at = new Date();
        BrewService.updateBrew($scope.selectedBrew).then(function(response) {
            var b = response.data;
            $scope.selectedBrew = b;
            $scope.selectedBrew.active = BrewService.isBrewActive($scope.selectedBrew);
        });
    }

    $scope.stopBrew = function startBrew() {
        $scope.selectedBrew.ended_at = new Date();
        BrewService.updateBrew($scope.selectedBrew).then(function(response) {
            var b = response.data;
            $scope.selectedBrew = b;
            $scope.selectedBrew.active = BrewService.isBrewActive($scope.selectedBrew);
            $scope.selectedBrew.ended = BrewService.isBrewEnded($scope.selectedBrew);
        });
    }


}