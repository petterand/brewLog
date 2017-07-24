angular.module('app').service('BrewService', BrewService);

BrewService.$inject = ['$http', '$q'];

function BrewService($http, $q) {
    return {
        getBrews: getBrews,
        saveBrew: saveBrew,
        updateBrew: updateBrew,
        isBrewActive: isBrewActive,
        isBrewEnded: isBrewEnded
    };

    function getBrews() {
        var deferred = $q.defer();
        $http.get('/brews').then(function(response) {
            var data = response.data;

            data.forEach(function(item) {
                item.active = isBrewActive(item);
                item.ended = isBrewEnded(item);
            });
            deferred.resolve(data);
        });

        return deferred.promise;

    }

    function isBrewEnded(brew) {
        return Boolean(brew.started_at) && Boolean(brew.ended_at);
    }

    function isBrewActive(brew) {
        return Boolean(brew.started_at) && !Boolean(brew.ended_at);
    }

    function saveBrew(brew) {
        var deferred = $q.defer();
        var data = brew;
        $http.post('/brews', data).then(function(response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    function updateBrew(brew) {
        var deferred = $q.defer();
        var data = brew;
        $http.put('/brews', data).then(function(response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

}