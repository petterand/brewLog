angular.module('app').controller(HeaderController);

HeaderController.$inject = ['$scope'];

function HeaderController($scope) {
    $scope.foo = "bar";
}