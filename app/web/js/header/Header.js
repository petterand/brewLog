angular.module('app').controller('HeaderController', HeaderController);

HeaderController.$inject = ['$scope', 'BrewService'];

function HeaderController($scope, BrewService) {

    $scope.brew = {};

    $scope.saveBrew = function saveBrew(brew) {
        BrewService.saveBrew(brew);
        $scope.brew = {};
    }

}