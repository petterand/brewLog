angular.module('app').service('BrewService', BrewService);

BrewService.$inject = ['$http', '$q'];

function BrewService($http, $q) {
    return {
        getBrews: getBrews,
        saveBrew: saveBrew
    };

    function getBrews() {
        var deferred = $q.defer();
        $http.get('http://localhost/brewlog/api/brews').then(function(response) {
            deferred.resolve(response.data);
        });

        return deferred.promise;

    }

    function saveBrew(brew) {
        var deferred = $q.defer();
        var data = brew;
        $http.post('http://localhost/brewlog/api/brews', data).then(function(response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

}