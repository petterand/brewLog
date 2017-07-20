angular.module('app').controller('BrewsController', BrewsController);

BrewsController.$inject = ['$scope', 'BrewService'];

function BrewsController($scope, BrewService) {
    BrewService.getBrews().then(function(brews) {
        $scope.brews = brews;
    });

    $scope.selectBrew = function selectBrew(brew) {
        console.log('select', brew);
        $scope.selectedBrew = brew;
    };

    $scope.deleteBrew = function deleteBrew(brew) {
        console.log('delete', brew);
    };
}